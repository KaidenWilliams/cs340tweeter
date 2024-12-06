export class User {
  constructor(
    public alias: string,
    public password_hash: string,
    public first_name: string,
    public last_name: string,
    public image_url: string
  ) {}
}
