import { Lawyer } from "../../../domain/entities/Lawyer";
import { ResponseGetLawyersDTO, IGetAllLawyerDTO } from "../../dtos/user/ResponseGetLawyersDTO";



export class UserLawyerMapper {
    static toGetLawyerDTO(lawyer: Lawyer): ResponseGetLawyersDTO {
        const dto: ResponseGetLawyersDTO = {
            id: lawyer.id!,
            userId:lawyer.userId,
            name: lawyer.user?.name ?? '',
            email: lawyer.user?.email ?? '',
            phone: String(lawyer.user?.phone ?? '0'),
            yearsOfPractice: lawyer.yearsOfPractice,
            practiceAreas: lawyer.practiceAreas,
            languages: lawyer.languages,
            profileImage: lawyer.profileImage


        }

        return dto
    }



    static toGetLawyerListDTO(lawyer: Lawyer[]): ResponseGetLawyersDTO[] {
        return lawyer.map(UserLawyerMapper.toGetLawyerDTO)
    }
}