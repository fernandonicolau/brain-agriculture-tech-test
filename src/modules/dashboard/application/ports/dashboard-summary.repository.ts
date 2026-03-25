import { DashboardSummaryResult } from '@/modules/dashboard/application/contracts/dashboard.contracts';

export const DASHBOARD_SUMMARY_REPOSITORY = Symbol('DASHBOARD_SUMMARY_REPOSITORY');

export interface DashboardSummaryRepositoryPort {
  getSummary(): Promise<DashboardSummaryResult>;
}
