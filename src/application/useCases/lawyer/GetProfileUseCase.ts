import { IGetProfileUseCase } from "../interface/lawyer/IProfileUseCases";
import { ILawyerRepository } from "../../../domain/repositories/lawyer/ILawyerRepository";
import { GetProfileMapper } from "../../mapper/lawyer/GetProfileMapper";
import { AppError } from "../../../infrastructure/errors/AppError";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";

export class GetProfileUseCase implements IGetProfileUseCase {
  constructor(private readonly _repo: ILawyerRepository) {}

  async execute(id: string): Promise<any> {

    try {


      const data = await this._repo.findById(id);

      if (!data) {
        throw new AppError(`Profile not found for user ID: ${id}`, HttpStatusCode.NOT_FOUND);
      }

   
      return GetProfileMapper.toDTO(data);

    } catch (err: any) {

      if (err instanceof AppError) throw err;

      
      throw new AppError(
        err.message || "Failed to fetch profile data.",
        HttpStatusCode.INTERNAL_SERVER_ERROR
      );
    }
  }
}
