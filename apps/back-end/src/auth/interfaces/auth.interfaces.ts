import { Request } from 'express';

export interface JwtPayload {
  sub: string;
  email: string;
  name?: string;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  name?: string;
}

export interface RequestWithUser extends Request {
  user: AuthenticatedUser;
}
