import { CreateAvailabilityRuleDTO } from "../../../application/dtos/lawyer/CreateAvailabilityRuleDTO";
import { UpdateAvailabilityRuleDTO } from "../../../application/dtos/lawyer/UpdateAvailabilityRuleDTO";
import { IAvailabilityRuleRepository } from "../../../domain/repositories/lawyer/IAvailabilityRuleRepository";
import AvailabilityRuleModel from "../../db/models/AvailabilityRuleModel";
import SlotModel from "../../db/models/SlotModel";
import { AvailabilityRule } from "../../../domain/entities/AvailabilityRule";
import { Slot } from "../../../domain/entities/Slot";
import mongoose from "mongoose";

export class AvailabilityRuleRepository implements IAvailabilityRuleRepository {

  /**
   * Create a new availability rule
   */
  async createRule(rule: CreateAvailabilityRuleDTO): Promise<any> {
    try {
      return await AvailabilityRuleModel.create(rule);
    } catch (err: any) {
      throw new Error("Failed to create availability rule: " + err.message);
    }
  }

  /**
   * Create all slots generated for the rule
   */
  async createSlots(ruleId: string,lawyerId:string, slots: any[]): Promise<any> {
    try {
      const formatted = slots.map(s => ({ ...s, ruleId,userId :lawyerId}));
    
      return await SlotModel.insertMany(formatted);
    } catch (err: any) {
      throw new Error("Failed to create slots: " + err.message);
    }
  }

  /**
   * Update an availability rule
   */
  async updateRule(ruleId: string, updated: UpdateAvailabilityRuleDTO): Promise<any> {
    try {
      const rule = await AvailabilityRuleModel.findByIdAndUpdate(ruleId, updated, { new: true });

      if (!rule) {
        throw new Error("Rule not found for update");
      }

      return rule;
    } catch (err: any) {
      throw new Error("Failed to update rule: " + err.message);
    }
  }

  /**
   * Delete all slots generated for a rule
   */
  async deleteSlotsByRuleId(ruleId: string): Promise<void> {
    try {
      await SlotModel.deleteMany({ ruleId });
    } catch (err: any) {
      throw new Error("Failed to delete slots for rule: " + err.message);
    }
  }

  /**
   * Get a specific rule by ID
   */
  async getRuleById(ruleId: string): Promise<any> {
    try {
      const rule = await AvailabilityRuleModel.findById(ruleId);

      if (!rule) {
        throw new Error("Rule not found");
      }

      return rule;
    } catch (err: any) {
      throw new Error("Failed to fetch rule: " + err.message);
    }
  }

  /**
   * Get all rules belonging to a specific lawyer
   */
  async getAllRules(id: string): Promise<AvailabilityRule[]> {
    try {
      const docs = await AvailabilityRuleModel.find({
        lawyerId: new mongoose.Types.ObjectId(id)
      });

      return docs.map((doc: any) =>
        new AvailabilityRule(
          doc._id.toString(),
          doc.title,
          doc.startTime,
          doc.endTime,
          doc.startDate,
          doc.endDate,
          doc.availableDays,
          doc.bufferTime,
          doc.slotDuration,
          doc.maxBookings,
          doc.sessionType,
          doc.exceptionDays,
          doc.lawyerId.toString(),
          doc.consultationFee
        )
      );
    } catch (err: any) {
      throw new Error("Failed to fetch availability rules: " + err.message);
    }
  }

  /**
   * Delete rule by ID
   */
  async deleteRuleById(ruleId: string): Promise<void> {
    try {
      const deleted = await AvailabilityRuleModel.findByIdAndDelete(ruleId);

      if (!deleted) {
        throw new Error("Rule not found to delete");
      }
    } catch (err: any) {
      throw new Error("Failed to delete rule: " + err.message);
    }
  }


  async getAllSlots(lawyerId: string): Promise<Slot[]> {
  try {
    const response = await SlotModel.find({ userId: lawyerId });

  
    const slots = response.map((slot: any) => 
      new Slot(
        slot._id.toString(),
         slot.ruleId,
        slot.userId,
        slot.startTime,
        slot.endTime,
        slot.date,
        slot.sessionType,
       
        slot.isBooked,
        slot.bookingId ?? null,
        slot.maxBookings,
        slot.consultationFee
      )
    );

    return slots;
  } catch (error) {
    console.error("Error fetching slots:", error);
    return [];
  }
}

}
