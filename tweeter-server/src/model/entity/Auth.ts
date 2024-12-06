export class Auth {
  constructor(
    public token: string,
    public timestamp: number,
    public expires_at: string // ISO date format
  ) {}
}
