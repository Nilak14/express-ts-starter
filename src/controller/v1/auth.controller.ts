import asyncHandler from "@/helpers/asyncHandler";
import { NextFunction, Request, Response } from "express";

export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    // Your DB and token logic

    /* use Error handler to throw error
    
    example: 
    import from CustomError.ts
    throw new NotFoundError("User not found");
    throw new BadRequestError("Invalid Credentials");

    rest will be handled by the error handler
    */

    res.status(201).json({
      message: "User logged in successfully",
      success: true,
      data: {
        user: {
          email,
          password,
        },
      },
    });
  }
);
