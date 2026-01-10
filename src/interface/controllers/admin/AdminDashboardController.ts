import { Request, Response, NextFunction } from "express";
import { IGetAdminDashboardStatsUseCase } from "../../../application/interface/use-cases/admin/IGetAdminDashboardStatsUseCase";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";
export class AdminDashboardController {
    constructor(private _getAdminDashboardStatsUseCase: IGetAdminDashboardStatsUseCase) { }

    async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { startDate, endDate } = req.query;
            let start: Date | undefined;
            let end: Date | undefined;

            if (startDate) {
                start = new Date(startDate as string);
                if (isNaN(start.getTime())) start = undefined;
            }
            if (endDate) {
                end = new Date(endDate as string);
                if (isNaN(end.getTime())) end = undefined;
            }

            const stats = await this._getAdminDashboardStatsUseCase.execute(start, end);
            res.status(HttpStatusCode.OK).json(stats);
        } catch (error) {
            next(error);
        }
    }
}
