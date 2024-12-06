export class UserEntity {
  constructor(
    public alias: string,
    public passwordHash: string,
    public firstName: string,
    public lastName: string,
    public imageUrl: string
  ) {}
}
