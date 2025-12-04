import { IGetAllLawyersUseCase } from "../interface/user/IGetAllLawyersUseCase";
import { ILawyerRepository } from "../../../domain/repositories/lawyer/ILawyerRepository";
import { UserLawyerMapper } from "../../mapper/user/UserLawyerMapper";
import { AppError } from "../../../infrastructure/errors/AppError";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";

export class GetAllLawyersUseCase implements IGetAllLawyersUseCase {
  constructor(private _repo: ILawyerRepository) {}

  async execute(query?: {
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
    filter?: string;
    fromAdmin?: boolean;
  }): Promise<any> {
    try {

      const { lawyers, total } = await this._repo.findAll(query);

      if (!lawyers || lawyers.length === 0) {
        throw new AppError("No lawyers found.", HttpStatusCode.NOT_FOUND);
      }

      const lawyerDTOs = UserLawyerMapper.toGetLawyerListDTO(lawyers);

      return {
        success: true,
        total,
        lawyers: lawyerDTOs,
      };

    } catch (error: any) {

      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        error.message || "Failed to fetch lawyers. Please try again later.",
        HttpStatusCode.INTERNAL_SERVER_ERROR
      );
    }
  }
}
