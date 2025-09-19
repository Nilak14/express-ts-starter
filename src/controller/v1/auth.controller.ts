import asyncHandler from "@/helpers/asyncHandler";
import { BadRequestError } from "@/helpers/CustomError";
import prisma from "@/lib/prisma";
import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";

/**
 * @swagger
 * components:
 *  schemas:
 *    Register:
 *      type: object
 *      required:
 *        - email
 *        - password
 *        - fullName
 *      properties:
 *        email:
 *          type: string
 *          format: email
 *        password:
 *          type: string
 *        fullName:
 *          type: string
 */

/**
 * @swagger
 * /api/v1/auth/register:
 *  post:
 *    tags:
 *      - Auth
 *    summary: Register a new User
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Register'
 *    responses:
 *      201:
 *        description: User registered successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                success:
 *                  type: boolean
 *                data:
 *                  type: object
 *                  properties:
 *                    user:
 *                      type: object
 *                      properties:
 *                        id:
 *                          type: string
 *                        email:
 *                          type: string
 *                        fullName:
 *                          type: string
 *                        role:
 *                          type: string
 *      400:
 *        description: Email already exists
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                success:
 *                  type: boolean
 *      500:
 *        description: Internal Server Error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                success:
 *                  type: boolean
 */

export const register = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, fullName } = req.body;
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    // check if user already exists
    if (existingUser) {
      throw new BadRequestError("Email already exists");
    }
    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        role: "USER",
        password: hashedPassword,
      },
      omit: {
        password: true, // do not include the password in return response
      },
    });
    res.status(201).json({
      message: "User registered successfully",
      success: true,
      data: {
        user,
      },
    });
  }
);

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

    // check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (!existingUser) {
      throw new BadRequestError("Invalid Credentials");
    }

    // check the password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password!
    );
    if (!isPasswordCorrect) {
      throw new BadRequestError("Invalid Credentials");
    }

    // in real world, we will use jwt tokens or sessions to manage the authentication

    res.status(201).json({
      message: "User logged in successfully",
      success: true,
      data: {
        user: {
          email: existingUser.email,
          fullName: existingUser.fullName,
          role: existingUser.role,
        },
      },
    });
  }
);
