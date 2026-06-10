import type { NextFunction, Request, Response } from "express";

export function errorHandler(
  err: Error & { status?: number },
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
  console.error(err);
}
