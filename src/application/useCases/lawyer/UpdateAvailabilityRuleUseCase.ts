import { SlotGeneratorService } from "../../../infrastructure/services/SlotGenerator/SlotGeneratorService";
import { IUpdateAvailabilityRuleUseCase } from "../interface/lawyer/ICreateAvailabilityRuleUseCase";
import { IAvailabilityRuleRepository } from "../../../domain/repositories/lawyer/IAvailabilityRuleRepository";
import { UpdateAvailabilityRuleDTO } from "../../dtos/lawyer/UpdateAvailabilityRuleDTO";



export class UpdateAvailabilityRuleUseCase implements IUpdateAvailabilityRuleUseCase{
    constructor(private readonly _repo:IAvailabilityRuleRepository){}



    async execute(ruleId:string,dto: UpdateAvailabilityRuleDTO): Promise<{ rule: any; slots: any; }> {
     try {
      const updateRule = await this._repo.updateRule(ruleId, dto);
      if (!updateRule) throw new Error("Rule not found");

   
      await this._repo.deleteSlotsByRuleId(ruleId);

     
      const newSlots = SlotGeneratorService.generateSlots(updateRule);
      if (!newSlots) throw new Error("Failed to generate slots");

    
      await this._repo.createSlots(ruleId,'', newSlots);

      return {
        rule: updateRule,
        slots: newSlots,
      };
    } catch (error: any) {
     
      throw new Error(error.message || "Failed to update rule");
    }
  }
}