import { CropResult } from '@/modules/crops/application/contracts/crops.contracts';

export type CreateHarvestCommand = {
  farmId: string;
  name: string;
  year: number;
};

export type UpdateHarvestCommand = Partial<CreateHarvestCommand>;

export type AttachCropCommand = {
  cropId: string;
};

export type ListHarvestsQuery = {
  page: number;
  limit: number;
  farmId?: string;
};

export type HarvestFarmSummaryResult = {
  id: string;
  name: string;
  city: string;
  state: string;
};

export type HarvestResult = {
  id: string;
  farmId: string;
  name: string;
  year: number;
  createdAt: string;
  updatedAt: string;
  farm?: HarvestFarmSummaryResult;
  crops?: CropResult[];
};

export type PaginatedHarvestsResult = {
  data: HarvestResult[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
};
