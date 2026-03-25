import { CropResult } from '@/modules/crops/application/contracts/crops.contracts';

export type CreateFarmCommand = {
  producerId: string;
  name: string;
  city: string;
  state: string;
  totalArea: number;
  arableArea: number;
  vegetationArea: number;
};

export type UpdateFarmCommand = Partial<CreateFarmCommand>;

export type ListFarmsQuery = {
  page: number;
  limit: number;
  producerId?: string;
  state?: string;
  city?: string;
};

export type FarmProducerSummaryResult = {
  id: string;
  document: string;
  name: string;
};

export type FarmHarvestResult = {
  id: string;
  name: string;
  year: number;
  crops?: CropResult[];
};

export type FarmResult = {
  id: string;
  producerId: string;
  name: string;
  city: string;
  state: string;
  totalArea: number;
  arableArea: number;
  vegetationArea: number;
  createdAt: string;
  updatedAt: string;
  producer?: FarmProducerSummaryResult;
  harvests?: FarmHarvestResult[];
};

export type PaginatedFarmsResult = {
  data: FarmResult[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
};
