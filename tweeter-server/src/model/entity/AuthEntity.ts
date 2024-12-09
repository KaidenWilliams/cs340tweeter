export class AuthEntity {
  constructor(
    public token: string,
    public timestamp: number,
    public expiresAt: number // ISO date format
  ) {}
}
