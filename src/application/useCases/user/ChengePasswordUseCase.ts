import { IUserRepository } from "../../../domain/repositories/user/ IUserRepository";
import { IChangePasswordUseCase } from "../../useCases/interface/user/IGetProfileUseCase";
import { ChangePasswordDTO } from "../../dtos/user/ChangePasswordDTO";
import { AppError } from "../../../infrastructure/errors/AppError";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";

export class ChangePasswordUseCase implements IChangePasswordUseCase {
  constructor(private readonly _user_repo: IUserRepository) { }

  async execute(dto: ChangePasswordDTO): Promise<{ message: string }> {


    const user = await this._user_repo.findById(dto.id);
    if (!user) {
      throw new AppError("User not found.", HttpStatusCode.NOT_FOUND);
    }


    try {
      const result = await this._user_repo.changePassword(
        dto.id,
        dto.oldPassword,
        dto.newPassword
      );



      return { message: "Password changed successfully." };

    } catch (err: any) {


      if (err instanceof AppError) throw err;



      throw new AppError(
        "Something went wrong while changing the password. Please try again.",
        HttpStatusCode.INTERNAL_SERVER_ERROR
      );
    }
  }
}
