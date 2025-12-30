import { ISubscriptionRepository } from "../../../domain/repositories/admin/ISubscriptionRepository";
import { Subscription } from "../../../domain/entities/Subscription";
import subscriptionModel from '../../../infrastructure/db/models/admin/subscriptionModel'



export class SubscriptionRepository implements ISubscriptionRepository {
    async create(data: any): Promise<void> {
        await subscriptionModel.create(data)
    }
}