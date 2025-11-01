import { UserRegisterDTO } from "../../dtos/user/ RegisterUserDTO";
import { User } from "../../../domain/entities/ User";

export class UserMapper {
    static toEntity(dto: User): UserRegisterDTO {
        return {
            name: dto.name,
            email: dto.email,
            phone: dto.phone,
            password: dto.password,
            isVerified: dto.isVerified || false,
            role: dto.role || "user",
        };
    }
}
