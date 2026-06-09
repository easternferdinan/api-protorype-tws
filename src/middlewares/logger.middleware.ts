import type { RequestHandler } from "express";

export const responseLogger: RequestHandler = (req, res, next) => {
  res.on("finish", () => {
    console.log(
      `[${res.statusCode} - ${res.statusMessage}] ${req.method}: ${req.originalUrl}`,
    );
  });

  next();
};
