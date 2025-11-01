import { Schema, model, Document,Types } from "mongoose";

export interface ILawyerDocument extends Document {
  // fullName: string;
  // email: string;
  // phone: string;
  userId: Types.ObjectId;
  barNumber: string;
  barAdmissionDate: string;
  yearsOfPractice: number;
  practiceAreas: string[];
  languages: string[];
  documentUrls: string[];
  dateOfBirth?: string;
  verificationStatus?: string;
  addresses?: string[];
  isVerified:boolean
  isBlock:boolean
}

const LawyerSchema = new Schema<ILawyerDocument>({
  // fullName: { type: String, required: true },
  // email: { type: String, required: true },
  // phone: { type: String, required: true },
   userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  barNumber: { type: String, required: true },
  barAdmissionDate: { type: String, required: true },
  yearsOfPractice: { type: Number, required: true },
  practiceAreas: { type: [String], required: true },
  languages: { type: [String], required: true },
  documentUrls: { type: [String], required: true },
  dateOfBirth: { type: String },
  verificationStatus: { type: String },
  addresses: { type: [String] },
   isVerified:{type:Boolean,default:false},
  isBlock:{type:Boolean,default:false},
});

export default model<ILawyerDocument>("Lawyer", LawyerSchema);
