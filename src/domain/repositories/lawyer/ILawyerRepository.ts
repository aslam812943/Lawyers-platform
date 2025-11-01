import { Lawyer } from "../../entities/Lawyer";
import { VerificationLawyerDTO } from "../../../application/dtos/lawyer/VerificationLawyerDTO";

export interface ILawyerRepository {
  createLawyer(lawyer: VerificationLawyerDTO): Promise<Lawyer>;
}
