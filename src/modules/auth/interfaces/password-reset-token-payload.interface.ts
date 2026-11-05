export interface PasswordResetTokenPayload {
  sub: number;
  email: string;
  purpose: 'password_reset';
  iat?: number;
  exp?: number;
}
