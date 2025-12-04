
import { Request, Response } from "express";
import { IGetAllLawyersUseCase } from "../../../application/useCases/interface/admin/IGetAllLawyersUseCase";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";


//  GetAllLawyersController

export class GetAllLawyersController {
  constructor(private _getAllLawyersUseCase: IGetAllLawyersUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
 

      const page = Number(req.query.page) || 1;          
      const limit = Number(req.query.limit) || 10;      
      const search = String(req.query.search || "");     

      
      const { lawyers, total } = await this._getAllLawyersUseCase.execute({
        page,
        limit,
        search,
        fromAdmin:true
      });

     
      res.status(HttpStatusCode.OK).json({
        success: true,
        message: "Lawyers fetched successfully.",
        lawyers,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
      });

    } catch (error: any) {
     

    
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message:
          error.message ||
          "An unexpected error occurred while fetching lawyers. Please try again later.",
      });
    }
  }
}
