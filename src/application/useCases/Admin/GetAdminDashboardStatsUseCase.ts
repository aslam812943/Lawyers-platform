import { IPaymentRepository } from "../../../domain/repositories/IPaymentRepository";
import { DashboardStatsDTO } from "../../dtos/admin/DashboardStatsDTO";
import { IGetAdminDashboardStatsUseCase } from "../../interface/use-cases/admin/IGetAdminDashboardStatsUseCase";
export class GetAdminDashboardStatsUseCase implements IGetAdminDashboardStatsUseCase {
    constructor(private _paymentRepository: IPaymentRepository) { }

    async execute(startDate?: Date, endDate?: Date): Promise<DashboardStatsDTO> {
        return await this._paymentRepository.getDashboardStats(startDate, endDate);
    }
}
