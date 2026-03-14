import { DashboardService } from './dashboard.service';

describe('DashboardService', () => {
  let service: DashboardService;
  let farmsRepository: {
    createQueryBuilder: jest.Mock;
  };
  let harvestCropsRepository: {
    createQueryBuilder: jest.Mock;
  };

  beforeEach(() => {
    const totalsBuilder = {
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      getRawOne: jest.fn().mockResolvedValue({
        farms: '10',
        totalHectares: '12345',
      }),
    };

    const statesBuilder = {
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      addOrderBy: jest.fn().mockReturnThis(),
      getRawMany: jest.fn().mockResolvedValue([
        { state: 'MG', count: '4' },
        { state: 'SP', count: '6' },
      ]),
    };

    const landUseBuilder = {
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      getRawOne: jest.fn().mockResolvedValue({
        arableArea: '8000',
        vegetationArea: '4345',
      }),
    };

    const byCropBuilder = {
      innerJoin: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      addOrderBy: jest.fn().mockReturnThis(),
      getRawMany: jest.fn().mockResolvedValue([
        { crop: 'Soja', count: '7' },
        { crop: 'Milho', count: '3' },
      ]),
    };

    farmsRepository = {
      createQueryBuilder: jest
        .fn()
        .mockReturnValueOnce(totalsBuilder)
        .mockReturnValueOnce(statesBuilder)
        .mockReturnValueOnce(landUseBuilder),
    };

    harvestCropsRepository = {
      createQueryBuilder: jest.fn().mockReturnValue(byCropBuilder),
    };

    service = new DashboardService(farmsRepository as never, harvestCropsRepository as never);
  });

  it('returns the aggregated dashboard payload', async () => {
    const result = await service.getSummary();

    expect(result).toEqual({
      totals: {
        farms: 10,
        totalHectares: 12345,
      },
      byState: [
        { state: 'MG', count: 4 },
        { state: 'SP', count: 6 },
      ],
      byCrop: [
        { crop: 'Soja', count: 7 },
        { crop: 'Milho', count: 3 },
      ],
      landUse: {
        arableArea: 8000,
        vegetationArea: 4345,
      },
    });
  });
});
