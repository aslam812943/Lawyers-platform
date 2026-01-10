import { DashboardStatsDTO } from "../../../dtos/admin/DashboardStatsDTO"

export interface IGetAdminDashboardStatsUseCase {
    execute(startDate?: Date, endDate?: Date): Promise<DashboardStatsDTO>
}