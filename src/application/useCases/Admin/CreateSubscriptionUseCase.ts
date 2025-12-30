import { ICreateSubscriptionUseCase } from "../../interface/use-cases/admin/ICreateSubscriptionUseCase";
import { ISubscriptionRepository } from "../../../domain/repositories/admin/ISubscriptionRepository";
import { ConflictError } from "../../../infrastructure/errors/ConflictError";
import { BadRequestError } from "../../../infrastructure/errors/BadRequestError"
import { CreateSubscriptionDTO } from "../../dtos/admin/CreateSubscriptionDTO";
export class CreateSubscriptionUseCase implements ICreateSubscriptionUseCase {
    constructor(private subscriptionRepository: ISubscriptionRepository) { }
async execute(data: CreateSubscriptionDTO): Promise<void> {
     

        if (!data.planName || !data.duration || !data.durationUnit || data.price < 0 || data.commissionPercent < 0) {
            throw new BadRequestError("Invalid subscription data provided.");
        }

     
        try {
            await this.subscriptionRepository.create(data);
        } catch (error: any) {
            if (error.code === 11000) { 
                throw new ConflictError("Subscription plan with this name already exists.");
            }
            throw error;
        }
}
 
}
