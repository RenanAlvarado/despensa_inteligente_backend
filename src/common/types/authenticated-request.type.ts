import { Request } from 'express';
import { JwtPayload } from '../../modules/auth/interfaces/jwt-payload.interface';

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}
