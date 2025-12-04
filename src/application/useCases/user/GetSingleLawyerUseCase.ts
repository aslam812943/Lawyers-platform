import { IGetSingleLawyerUseCase } from "../interface/user/IGetAllLawyersUseCase";
import { ILawyerRepository } from "../../../domain/repositories/lawyer/ILawyerRepository";
import { LawyerMapper } from "../../mapper/lawyer/LawyerMapper";
import { ResponseGetSingleLawyerDTO } from "../../dtos/user/ResponseGetSingleLawyerDTO";
import { AppError } from "../../../infrastructure/errors/AppError";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";

export class GetSingleLawyerUseCase implements IGetSingleLawyerUseCase {

  constructor(private _repo: ILawyerRepository) {}

  async execute(id: string): Promise<ResponseGetSingleLawyerDTO> {

    if (!id) {
      throw new AppError("Lawyer ID is required.", HttpStatusCode.BAD_REQUEST);
    }

    const lawyer = await this._repo.getSingleLawyer(id);

    if (!lawyer) {
      throw new AppError("Lawyer not found.", HttpStatusCode.NOT_FOUND);
    }

    return LawyerMapper.toSingle(lawyer);
  }
}
