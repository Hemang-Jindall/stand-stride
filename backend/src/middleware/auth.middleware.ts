import {
  Request,
  Response,
  NextFunction,
} from "express";

import jwt from "jsonwebtoken";

export type UserRole = "admin" | "student";

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader =
    req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "No token provided",
    });
  }

  const [type, token] =
    authHeader.split(" ");

  if (
    type !== "Bearer" ||
    !token
  ) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }

  const secret =
    process.env.JWT_SECRET;

  if (!secret) {
    console.error(
      "JWT_SECRET is missing"
    );

    return res.status(500).json({
      message:
        "Server configuration error",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      secret
    ) as {
      id: string;
      email: string;
      role?: UserRole;
    };

    req.user = {
      id: decoded.id,
      email: decoded.email,

      // Existing admin tokens were created
      // before we added roles.
      role: decoded.role ?? "admin",
    };

    next();
  } catch {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};