import { IUserRepository } from "../../../domain/repositories/user/ IUserRepository";
import { AppError } from "../../../infrastructure/errors/AppError";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";

export class CheckUserStatusUseCase {
  constructor(private _repo: IUserRepository) {}

  async check(id: string): Promise<{ isActive: boolean }> {

    if (!id) {
      throw new AppError("User ID is required.", HttpStatusCode.BAD_REQUEST);
    }

    const user = await this._repo.findById(id);

    if (!user) {
      throw new AppError("User not found.", HttpStatusCode.NOT_FOUND);
    }

    return { isActive: !user.isBlock };
  }
}
