import { Response } from "express";

export enum ErrorType {
  BAD_REQUEST = "BadRequest",
  NOT_FOUND = "NotFound",
  UNAUTHORIZED = "Unauthorized",
  FORBIDDEN = "Forbidden",
  INTERNAL_SERVER_ERROR = "InternalServerError",
  TOKEN_EXPIRED = "TokenExpired",
  BAD_TOKEN = "BadToken",
  ACCESS_TOKEN_ERROR = "AccessTokenError",
}

export class ApiError extends Error {
  type: ErrorType;
  statusCode: number;
  constructor(type: ErrorType, statusCode: number, message: string) {
    super(message);
    this.type = type;
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
  static handle(err: ApiError, res: Response) {
    res.status(err.statusCode || 500).json({
      success: false,
      type: err.type || ErrorType.INTERNAL_SERVER_ERROR,
      message: err.message || "Something went wrong",
    });
  }
}
