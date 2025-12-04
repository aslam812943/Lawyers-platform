import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { HttpStatusCode } from "../../infrastructure/interface/enums/HttpStatusCode";
import { CheckUserStatusUseCase } from "../../application/useCases/user/checkUserStatusUseCase";
import { ITokenService } from "../../application/interface/services/TokenServiceInterface";

interface JwtPayload {
  id: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export class AuthMiddleware {
  constructor(
    private readonly allowedRoles: string[] | undefined,
    private readonly checkUserStatusUseCase: CheckUserStatusUseCase,
    private readonly tokenService: ITokenService
  ) { }

  execute = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    try {
      let token =
        req.cookies?.lawyerAccessToken ||
        req.cookies?.userAccessToken ||
        req.headers.authorization?.split(" ")[1];

      if (!token) {

        res.status(HttpStatusCode.UNAUTHORIZED).json({ success: false, message: "No token provided." });
        return;
      }

      // Decode JWT
      let decoded: JwtPayload;

      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
      
      } catch (error: any) {

        if (error.name === "TokenExpiredError") {

          const refreshToken = req.cookies?.lawyerRefreshToken || req.cookies?.userRefreshToken;

          if (!refreshToken) {
            res.status(HttpStatusCode.UNAUTHORIZED).json({ success: false, message: "Session expired. Please login again." });
            return;
          }

          try {

            const refreshDecoded = this.tokenService.verifyToken(refreshToken, true) as JwtPayload;


            const newAccessToken = this.tokenService.generateAccessToken(refreshDecoded.id, refreshDecoded.role, refreshToken.isBlock);

            if (refreshDecoded.role === 'user') {
              res.cookie("userAccessToken", newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 15 * 60 * 1000,
              });
            } else {
              res.cookie("lawyerAccessToken", newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 15 * 60 * 1000
              });
            }


            decoded = refreshDecoded;
          } catch (refreshError) {

            res.status(HttpStatusCode.FORBIDDEN).json({ success: false, message: "Invalid refresh token." });
            return;
          }
        } else {
          throw error;
        }
      }

      req.user = decoded;


      if (this.allowedRoles && !this.allowedRoles.includes(decoded.role)) {

        res.status(HttpStatusCode.FORBIDDEN).json({ success: false, message: "Access denied." });
        return;
      }


      const status = await this.checkUserStatusUseCase.check(decoded.id);

      if (!status.isActive) {

        if (decoded.role == 'user') {
          res.clearCookie("userAccessToken", {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: '/'
          });

          res.clearCookie("userRefreshToken", {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: '/'
          });
        } else {
          res.clearCookie("lawyerAccessToken", {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: '/'
          });

          res.clearCookie("lawyerRefreshToken", {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: '/'
          });
        }

        res.status(HttpStatusCode.FORBIDDEN).json({

          success: false,
          message: "Your account has been blocked or disabled.",
        });

        return;
      }

      next();
    } catch (error) {

      res.status(HttpStatusCode.FORBIDDEN).json({ success: false, message: "Invalid or expired token." });
    }
  };
}
