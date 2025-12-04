import { ILawyerRepository } from "../../../domain/repositories/lawyer/ILawyerRepository";
import { IChangePasswordUseCase } from "../../useCases/interface/lawyer/IProfileUseCases";
import { ChangePasswordDTO } from "../../dtos/lawyer/ChangePasswordDTO";
import { AppError } from "../../../infrastructure/errors/AppError";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";

export class ChangePasswordUseCase implements IChangePasswordUseCase {
    constructor(private readonly _lawyer_repo: ILawyerRepository) { }

    async execute(dto: ChangePasswordDTO): Promise<{ message: string }> {
        
        try {

            
            if (!dto.id) {
                throw new AppError("Lawyer ID is required.", HttpStatusCode.BAD_REQUEST);
            }

            if (!dto.oldPassword || !dto.newPassword) {
                throw new AppError("Old and new password are required.", HttpStatusCode.BAD_REQUEST);
            }


            const result = await this._lawyer_repo.changePassword(
                dto.id,
                dto.oldPassword,
                dto.newPassword
            );

         

            return { message: "Password changed successfully." };

        } catch (err: any) {

            
            if (err instanceof AppError) throw err;

          
            throw new AppError(
                err.message || "Password change failed.",
                HttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }
    }
}
