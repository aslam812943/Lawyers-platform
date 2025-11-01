export interface Lawyer {
  id?: string;
  userId:string;
  // fullName: string;
  // email: string;
  // phone: string;
  barNumber: string;
  barAdmissionDate: string;
  yearsOfPractice: number;
  practiceAreas: string[];
  languages: string[];
  documentUrls: string[];
  dateOfBirth?: string;
  verificationStatus?: string;
  addresses?: string[];
}
