import { AuthToken, User } from "tweeter-shared";
import { ServerFacade } from "../api/ServerFacade";
import { Buffer } from "buffer";

export class UserService {
  private serverFacade: ServerFacade;

  constructor() {
    this.serverFacade = this.getServerFacade();
  }

  private getServerFacade() {
    return new ServerFacade();
  }

  public async getUser(authToken: AuthToken, alias: string): Promise<User | null> {
    const request = {
      token: authToken.token,
      alias,
    };

    return await this.serverFacade.grabUser(request);
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[User, AuthToken]> {
    const request = {
      firstName,
      lastName,
      alias,
      password,
      userImageBytes: Buffer.from(userImageBytes).toString("base64"),
      imageFileExtension,
    };

    return await this.serverFacade.doRegister(request);
  }

  public async login(alias: string, password: string): Promise<[User, AuthToken]> {
    const request = {
      alias,
      password,
    };

    return await this.serverFacade.doLogin(request);
  }

  public async logout(authToken: AuthToken): Promise<void> {
    const request = {
      token: authToken.token,
    };

    return await this.serverFacade.doLogout(request);
  }
}
