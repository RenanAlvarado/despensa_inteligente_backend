export interface PasswordResetTokenPayload {
  sub: number;
  purpose: 'password_reset';
  iat?: number;
  exp?: number;
}
