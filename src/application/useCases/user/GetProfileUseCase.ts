import { IGetProfileUseCase } from "../interface/user/IGetProfileUseCase";
import { IUserRepository } from "../../../domain/repositories/user/ IUserRepository";
import { ResponseGetProfileDTO } from "../../dtos/user/ResponseGetProfileDTO";
import { AppError } from "../../../infrastructure/errors/AppError";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";

export class GetProfileUseCase implements IGetProfileUseCase {
  constructor(private readonly _repo: IUserRepository) {}

  async execute(id: string): Promise<ResponseGetProfileDTO> {

   
    if (!id) {
      throw new AppError("User ID is required to fetch profile.", HttpStatusCode.BAD_REQUEST);
    }

    const data = await this._repo.findById(id);

    if (!data) {
      throw new AppError(`User not found for ID: ${id}`, HttpStatusCode.NOT_FOUND);
    }

    const userDTO = new ResponseGetProfileDTO(
      data.id ?? "",
      data.name ?? "",
      data.email ?? "",
      data.phone ? String(data.phone) : "",
      data.profileImage ?? "",
      data.address ?? {},
      data.isPassword ?? true
    );

    return userDTO;
  }
}
