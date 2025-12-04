import { IAvailabilityRuleRepository } from "../../../domain/repositories/lawyer/IAvailabilityRuleRepository";
import { IGetAllSlotsUseCase } from "../interface/user/IGetAllLawyersUseCase";
import { AvailabilityRuleMapper } from "../../mapper/lawyer/AvailabilityRuleMapper";
import { AppError } from "../../../infrastructure/errors/AppError";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";

export class GetAllSlotsUseCase implements IGetAllSlotsUseCase {

  constructor(private _slotRepository: IAvailabilityRuleRepository) {}

  async execute(lawyerId: string): Promise<any> {
    
    if (!lawyerId) {
      throw new AppError("Lawyer ID is required to fetch slots.", HttpStatusCode.BAD_REQUEST);
    }

    const slots = await this._slotRepository.getAllSlots(lawyerId);

    return AvailabilityRuleMapper.toDTOSlots(slots);
  }
}
