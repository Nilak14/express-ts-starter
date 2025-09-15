import { logger } from "@/lib/winston";
import { Request, Response } from "express";

export const sayHello = async (req: Request, res: Response): Promise<void> => {
  try {
    res.status(200).json({
      message: "Hello User",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      code: "ServerError",
      message: "Internal Server Error",
      error: error,
    });
    logger.error("Error In Say Hello", error);
  }
};
