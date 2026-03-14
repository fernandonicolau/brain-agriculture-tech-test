import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Farm } from '../agriculture/entities/farm.entity';
import { HarvestCrop } from '../agriculture/entities/harvest-crop.entity';
import { DashboardResponseDto } from './dto/dashboard-response.dto';

type TotalsRaw = {
  farms: string;
  totalHectares: string | null;
};

type ByStateRaw = {
  state: string;
  count: string;
};

type ByCropRaw = {
  crop: string;
  count: string;
};

type LandUseRaw = {
  arableArea: string | null;
  vegetationArea: string | null;
};

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Farm)
    private readonly farmsRepository: Repository<Farm>,
    @InjectRepository(HarvestCrop)
    private readonly harvestCropsRepository: Repository<HarvestCrop>,
  ) {}

  async getSummary(): Promise<DashboardResponseDto> {
    const [totals, byState, byCrop, landUse] = await Promise.all([
      this.getTotals(),
      this.getByState(),
      this.getByCrop(),
      this.getLandUse(),
    ]);

    return {
      totals,
      byState,
      byCrop,
      landUse,
    };
  }

  private async getTotals(): Promise<DashboardResponseDto['totals']> {
    const rawTotals = await this.farmsRepository
      .createQueryBuilder('farm')
      .select('COUNT(farm.id)', 'farms')
      .addSelect('COALESCE(SUM(farm.total_area), 0)', 'totalHectares')
      .getRawOne<TotalsRaw>();

    return {
      farms: Number(rawTotals?.farms ?? 0),
      totalHectares: Number(rawTotals?.totalHectares ?? 0),
    };
  }

  private async getByState(): Promise<DashboardResponseDto['byState']> {
    const rawStates = await this.farmsRepository
      .createQueryBuilder('farm')
      .select('farm.state', 'state')
      .addSelect('COUNT(farm.id)', 'count')
      .groupBy('farm.state')
      .orderBy('count', 'DESC')
      .addOrderBy('farm.state', 'ASC')
      .getRawMany<ByStateRaw>();

    return rawStates.map((item) => ({
      state: item.state,
      count: Number(item.count),
    }));
  }

  private async getByCrop(): Promise<DashboardResponseDto['byCrop']> {
    const rawCrops = await this.harvestCropsRepository
      .createQueryBuilder('harvestCrop')
      .innerJoin('harvestCrop.crop', 'crop')
      .select('crop.name', 'crop')
      .addSelect('COUNT(harvestCrop.id)', 'count')
      .groupBy('crop.name')
      .orderBy('count', 'DESC')
      .addOrderBy('crop.name', 'ASC')
      .getRawMany<ByCropRaw>();

    return rawCrops.map((item) => ({
      crop: item.crop,
      count: Number(item.count),
    }));
  }

  private async getLandUse(): Promise<DashboardResponseDto['landUse']> {
    const rawLandUse = await this.farmsRepository
      .createQueryBuilder('farm')
      .select('COALESCE(SUM(farm.arable_area), 0)', 'arableArea')
      .addSelect('COALESCE(SUM(farm.vegetation_area), 0)', 'vegetationArea')
      .getRawOne<LandUseRaw>();

    return {
      arableArea: Number(rawLandUse?.arableArea ?? 0),
      vegetationArea: Number(rawLandUse?.vegetationArea ?? 0),
    };
  }
}
