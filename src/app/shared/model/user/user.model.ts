export class User {
  sub: string;
  email: string;
  exp?: number;
  iat?: number;
  permissions?: string[];
}
