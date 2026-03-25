export type DashboardTotalsResult = {
  farms: number;
  totalHectares: number;
};

export type DashboardByStateResult = {
  state: string;
  count: number;
};

export type DashboardByCropResult = {
  crop: string;
  count: number;
};

export type DashboardLandUseResult = {
  arableArea: number;
  vegetationArea: number;
};

export type DashboardSummaryResult = {
  totals: DashboardTotalsResult;
  byState: DashboardByStateResult[];
  byCrop: DashboardByCropResult[];
  landUse: DashboardLandUseResult;
};
