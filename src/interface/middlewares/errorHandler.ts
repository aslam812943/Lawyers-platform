import { Request,Response,NextFunction } from "express";
import { AppError } from "../../infrastructure/errors/AppError";
import { HttpStatusCode } from "../../infrastructure/interface/enums/HttpStatusCode";



export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }


  return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: "Internal Server Error",
  });
};