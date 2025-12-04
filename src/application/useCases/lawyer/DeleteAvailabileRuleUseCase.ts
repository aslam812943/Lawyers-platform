import { IDeleteAvailableRuleUseCase } from "../interface/lawyer/ICreateAvailabilityRuleUseCase";
import { IAvailabilityRuleRepository } from "../../../domain/repositories/lawyer/IAvailabilityRuleRepository";
import { AppError } from "../../../infrastructure/errors/AppError";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";

export class DeleteAvailableRuleUseCase implements IDeleteAvailableRuleUseCase {

    constructor(private readonly _ruleRepo: IAvailabilityRuleRepository) {}

    async execute(ruleId: string): Promise<void> {

        try {

        
            await Promise.all([
                this._ruleRepo.deleteRuleById(ruleId),
                this._ruleRepo.deleteSlotsByRuleId(ruleId)
            ]);

            return;

        } catch (err: any) {

         
            if (err instanceof AppError) throw err;

         
            throw new AppError(
                err.message || "Failed to delete availability rule.",
                HttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }
    }
}
