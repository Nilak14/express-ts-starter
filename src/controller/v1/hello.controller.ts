import asyncHandler from "@/helpers/asyncHandler";
import { BadRequestError } from "@/helpers/CustomError";
import { logger } from "@/lib/winston";
import { Request, Response } from "express";

export const sayHello = asyncHandler(async (req: Request, res: Response) => {
  const { error } = req.query;
  if (error) {
    logger.error("Error In Say Hello", error);
    throw new BadRequestError("Hello");
  }
  res.status(200).json({
    message: "Hello User",
    success: true,
  });
});
