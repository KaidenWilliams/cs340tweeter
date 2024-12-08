export class AuthEntity {
  constructor(
    public token: string,
    public timestamp: number,
    public expiresAt: string // ISO date format
  ) {}
}
