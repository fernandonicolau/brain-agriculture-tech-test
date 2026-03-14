type FarmAreaPayload = {
  totalArea: number;
  arableArea: number;
  vegetationArea: number;
};

export function isFarmAreaUsageValid({
  totalArea,
  arableArea,
  vegetationArea,
}: FarmAreaPayload): boolean {
  return arableArea + vegetationArea <= totalArea;
}
