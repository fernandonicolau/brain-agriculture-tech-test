import { Inject, Injectable } from '@nestjs/common';

import { DashboardSummaryResult } from '@/modules/dashboard/application/contracts/dashboard.contracts';
import {
  DASHBOARD_SUMMARY_REPOSITORY,
  DashboardSummaryRepositoryPort,
} from '@/modules/dashboard/application/ports/dashboard-summary.repository';

@Injectable()
export class DashboardService {
  constructor(
    @Inject(DASHBOARD_SUMMARY_REPOSITORY)
    private readonly dashboardSummaryRepository: DashboardSummaryRepositoryPort,
  ) {}

  getSummary(): Promise<DashboardSummaryResult> {
    return this.dashboardSummaryRepository.getSummary();
  }
}
