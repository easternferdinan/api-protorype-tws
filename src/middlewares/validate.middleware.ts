import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { formatZodError } from "../utils/format-zod-error.js";

export function validate(schema: z.ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        errors: formatZodError(result.error),
      });
    }

    req.body = result.data;

    next();
  };
}