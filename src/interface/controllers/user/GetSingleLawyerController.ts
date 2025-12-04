import { Request, Response, NextFunction } from "express";
import { IGetSingleLawyerUseCase } from "../../../application/useCases/interface/user/IGetAllLawyersUseCase";
import { IGetAllSlotsUseCase } from "../../../application/useCases/interface/user/IGetAllLawyersUseCase";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";
import { AppError } from "../../../infrastructure/errors/AppError";

export class GetSingleLawyerController {
  constructor(
    private _getsinglelawyerusecase: IGetSingleLawyerUseCase,
    private _getslotusecase: IGetAllSlotsUseCase
  ) {}

  async getlawyer(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;

      if (!id) {
        throw new AppError("Lawyer ID is required.", HttpStatusCode.BAD_REQUEST);
      }

      const lawyer = await this._getsinglelawyerusecase.execute(id);

      if (!lawyer) {
        throw new AppError("Lawyer not found.", HttpStatusCode.NOT_FOUND);
      }

      return res.status(HttpStatusCode.OK).json({
        success: true,
        message: "Lawyer fetched successfully",
        data: lawyer,
      });

    } catch (error) {
      next(error); 
    }
  }


  async getallslots(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;

      if (!id) {
        throw new AppError("Lawyer ID is required to fetch slots.", HttpStatusCode.BAD_REQUEST);
      }

      const slots = await this._getslotusecase.execute(id);

      if (!slots || slots.length === 0) {
        throw new AppError("No slots available for this lawyer.", HttpStatusCode.NOT_FOUND);
      }

      return res.status(HttpStatusCode.OK).json({
        success: true,
        message: "Slots fetched successfully",
        data: slots,
      });

    } catch (error) {
      next(error);
    }
  }
}
