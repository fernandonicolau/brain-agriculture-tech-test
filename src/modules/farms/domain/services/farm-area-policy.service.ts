import { isFarmAreaUsageValid } from '@/common/validators/farm-area.validator';

export type FarmAreaPayload = {
  totalArea: number;
  arableArea: number;
  vegetationArea: number;
};

export class FarmAreaPolicyService {
  static isValid(payload: FarmAreaPayload): boolean {
    return isFarmAreaUsageValid(payload);
  }
}
