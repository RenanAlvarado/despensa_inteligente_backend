import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: {
    sub: number;
    email: string;
  };
}
