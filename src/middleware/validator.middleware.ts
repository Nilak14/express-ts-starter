import { NextFunction, Request, Response } from "express";
import { z, ZodError } from "zod";
import { ValidationError } from "../helpers/CustomError";

export enum ValidationSource {
  BODY = "body",
  QUERY = "query",
  HEADER = "header",
  PARAMS = "params",
}

const validateRequest = (
  schema: z.ZodSchema,
  source: ValidationSource = ValidationSource.BODY
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = schema.parse(req[source]);
      Object.assign(req[source], data);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        // you can format result.error to a friendly message/list
        const messages = err.issues.map((issue) => issue.message).join(", ");
        return next(new ValidationError(messages));
      } else {
        next(err);
      }
    }
  };
};

export default validateRequest;
