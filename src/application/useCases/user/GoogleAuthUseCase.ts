import { IUserRepository } from '../../../domain/repositories/user/ IUserRepository';
import { User } from '../../../domain/entities/ User';
import { GoogleAuthService } from '../../../infrastructure/services/googleAuth/GoogleAuthService';
import { TokenService } from '../../../infrastructure/services/jwt/TokenService';
import { GoogleAuthResponseDTO } from '../../dtos/user/GoogleAuthResponseDTO';
import { AppError } from '../../../infrastructure/errors/AppError';
import { HttpStatusCode } from '../../../infrastructure/interface/enums/HttpStatusCode';

export class GoogleAuthUsecase {

  constructor(
    private _userRepository: IUserRepository,
    private _googleAuthService: GoogleAuthService,
    private _tokenService: TokenService
  ) {}

  async execute(idToken: string, role?: 'user' | 'lawyer'): Promise<GoogleAuthResponseDTO> {
    
    if (!idToken) {
      throw new AppError("Google token is missing.", HttpStatusCode.BAD_REQUEST);
    }

    const payload = await this._googleAuthService.verifyToken(idToken);

    if (!payload || !payload.email) {
      throw new AppError("Invalid Google token.", HttpStatusCode.UNAUTHORIZED);
    }

    const { sub: googleId, email, given_name: firstName, family_name: lastName } = payload;

    let user = await this._userRepository.findByGoogleId(googleId);

    // Case 1: User exists by Google ID
    if (user) {
      if (user.isBlock) {
        throw new AppError("Your account has been blocked. Contact support.", HttpStatusCode.FORBIDDEN);
      }
    }

    
    if (!user) {
      user = await this._userRepository.findByEmail(email!);

      if (user) {

        if (user.isBlock) {
          throw new AppError("Your account is blocked. Contact support.", HttpStatusCode.FORBIDDEN);
        }

        user.googleId = googleId;

        if (!user.role && role) {
          user.role = role;
        }

        user = await this._userRepository.save(user);

      } else {

        if (!role) {
          return {
            needsRoleSelection: true
          } as GoogleAuthResponseDTO;
        }

        const newUser: Partial<User> = {
          name: `${firstName} ${lastName}`,
          email: email!,
          googleId,
          role,
          hasSubmittedVerification: false,
          isVerified: true,
          isBlock: false
        };

        user = await this._userRepository.createUser(newUser as User);
      }
    }

    
 

    const token = this._tokenService.generateAccessToken(user.id!,user.role,user.isBlock);
    const refreshToken = this._tokenService.generateRefreshToken(user.id!,user.role,user.isBlock);

    const response: GoogleAuthResponseDTO = {
      token,
      refreshToken,
      user: {
        id: user.id!,
        email: user.email,
        role: user.role! as 'user' | 'lawyer',
        name: user.name,
        phone: user.phone,
        hasSubmittedVerification: user.hasSubmittedVerification
      },
      needsRoleSelection: false
    };

    if (user.role === 'lawyer') {
      response.needsVerificationSubmission = !user.hasSubmittedVerification;
    }

    return response;
  }
}
