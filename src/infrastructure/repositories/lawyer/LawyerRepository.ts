import LawyerModel, { ILawyerDocument } from "../../db/models/LawyerModel";
import { VerificationLawyerDTO } from "../../../application/dtos/lawyer/VerificationLawyerDTO";
import { Lawyer } from "../../../domain/entities/Lawyer";
import { ILawyerRepository } from "../../../domain/repositories/lawyer/ILawyerRepository";
import {UserRepository} from '../user/UserRepository'
import {IUserRepository} from '../../../domain/repositories/user/ IUserRepository'

export class LawyerRepository implements ILawyerRepository {
  private userRepository: IUserRepository;
  constructor(){
       this.userRepository = new UserRepository();
  }
  async createLawyer(lawyer: VerificationLawyerDTO): Promise<Lawyer> {
   const lawyerDoc = (await LawyerModel.create({
      // userId: lawyer.userId,
      ...lawyer,
    })) as ILawyerDocument;

      await this.userRepository.markVerificationSubmitted(lawyerDoc.userId.toString());
    // await this.UserRepository.markVerificationSubmitted(lawyerDoc.userId);
    return {
      // id: lawyerDoc._id.toString(),
      // fullName: lawyerDoc.fullName,
      // email: lawyerDoc.email,
      // phone: lawyerDoc.phone,
      userId:lawyerDoc.userId.toString(),
      barNumber: lawyerDoc.barNumber,
      barAdmissionDate: lawyerDoc.barAdmissionDate,
      yearsOfPractice: lawyerDoc.yearsOfPractice,
      practiceAreas: lawyerDoc.practiceAreas,
      languages: lawyerDoc.languages,
      documentUrls: lawyerDoc.documentUrls,
      dateOfBirth: lawyerDoc.dateOfBirth,
      verificationStatus: lawyerDoc.verificationStatus,
      addresses: lawyerDoc.addresses,
    };
  }
}
