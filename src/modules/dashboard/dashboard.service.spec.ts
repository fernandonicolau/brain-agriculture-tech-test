import { DashboardSummaryRepositoryPort } from '@/modules/dashboard/application/ports/dashboard-summary.repository';

import { DashboardService } from './dashboard.service';

describe('DashboardService', () => {
  let service: DashboardService;
  let dashboardSummaryRepository: jest.Mocked<DashboardSummaryRepositoryPort>;

  beforeEach(() => {
    dashboardSummaryRepository = {
      getSummary: jest.fn().mockResolvedValue({
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
      }),
    };

    service = new DashboardService(dashboardSummaryRepository);
  });

  it('returns the aggregated dashboard payload', async () => {
    const result = await service.getSummary();

    expect(dashboardSummaryRepository.getSummary).toHaveBeenCalledTimes(1);
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
