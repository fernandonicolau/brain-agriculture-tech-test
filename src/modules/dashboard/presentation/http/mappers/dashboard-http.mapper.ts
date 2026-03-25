import { DashboardSummaryResult } from '@/modules/dashboard/application/contracts/dashboard.contracts';
import { DashboardResponseDto } from '@/modules/dashboard/presentation/http/dto/dashboard-response.dto';

export class DashboardHttpMapper {
  static toResponse(result: DashboardSummaryResult): DashboardResponseDto {
    return {
      totals: { ...result.totals },
      byState: result.byState.map((item) => ({ ...item })),
      byCrop: result.byCrop.map((item) => ({ ...item })),
      landUse: { ...result.landUse },
    };
  }
}
