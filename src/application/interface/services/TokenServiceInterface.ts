export interface ITokenService {
  generateAccessToken(id:string,role:string,isBlock:boolean): string;
  // generateToken(id: string, role: string): string;
  generateRefreshToken(id: string, role: string,isBlock:boolean): string;
  verifyToken(token: string, isRefresh?: boolean): any;
}
