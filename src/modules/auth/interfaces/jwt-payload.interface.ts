import { UserRole } from '../../users/enums/users-enums.enum';

export interface JwtPayload {
  sub: number;
  email: string;
  role: UserRole;
}
