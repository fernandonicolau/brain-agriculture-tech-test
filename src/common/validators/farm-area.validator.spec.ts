import { isFarmAreaUsageValid } from './farm-area.validator';

describe('isFarmAreaUsageValid', () => {
  it('returns true when the sum of arable and vegetation areas is equal to total area', () => {
    expect(
      isFarmAreaUsageValid({
        totalArea: 1000,
        arableArea: 700,
        vegetationArea: 300,
      }),
    ).toBe(true);
  });

  it('returns true when the sum of arable and vegetation areas is less than total area', () => {
    expect(
      isFarmAreaUsageValid({
        totalArea: 1000,
        arableArea: 650,
        vegetationArea: 200,
      }),
    ).toBe(true);
  });

  it('returns false when the sum of arable and vegetation areas exceeds total area', () => {
    expect(
      isFarmAreaUsageValid({
        totalArea: 1000,
        arableArea: 800,
        vegetationArea: 250,
      }),
    ).toBe(false);
  });
});
