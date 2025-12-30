import { Request, Response, NextFunction } from 'express';
import { ICreateSubscriptionUseCase } from '../../../application/interface/use-cases/admin/ICreateSubscriptionUseCase';
import { HttpStatusCode } from '../../../infrastructure/interface/enums/HttpStatusCode';
import { CreateSubscriptionDTO } from '../../../application/dtos/admin/CreateSubscriptionDTO';
export class CreateSubscriptionController {
    constructor(private createSubscriptionUseCase: ICreateSubscriptionUseCase) { }

    async create(req: Request, res: Response, next: NextFunction) {
        
        try {

const dto = new CreateSubscriptionDTO(req.body.planName,Number(req.body.duration),req.body.durationUnit,Number(req.body.price),Number(req.body.commissionPercent))
            await this.createSubscriptionUseCase.execute(
               dto
            );

            res.status(HttpStatusCode.CREATED).json({ 
                success: true,
                message: "Subscription plan created successfully."
            });
        } catch (error) {
            next(error);
        }
    }
}
