import asyncHandler from "@/helpers/asyncHandler";
import { NextFunction, Request, Response } from "express";

/**
 * @swagger
 * components:
 *  schemas:
 *    Login:
 *      type: object
 *      required:
 *        - email
 *        - password
 *      properties:
 *        email:
 *          type: string
 *          format: email
 *        password:
 *          type: string
 */

/**
 * @swagger
 * /api/v1/auth/login:
 *  post:
 *    tags:
 *      - Auth
 *    summary: Login a User
 *    security:
 *      - Bearer: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Login'
 *    responses:
 *      201:
 *        description: User logged in successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Login'
 *      400:
 *        description: Invalid Credentials
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Login'
 *      401:
 *        description: Unauthorized
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Login'
 *      500:
 *        description: Internal Server Error
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Login'
 */

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
        },
      },
    });
  }
);
