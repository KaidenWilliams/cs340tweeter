export class AuthEntity {
  constructor(public token: string, public alias: string, public expiresAt: number) {}
}
