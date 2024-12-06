import { Buffer } from "buffer";
import { FakeData, UserDto, UserMapper } from "tweeter-shared";
import { DaoFactory } from "../dao/daoFactory/DaoFactory";

export class UserService {
  private readonly daoFactory: DaoFactory;

  constructor(daoFactory: DaoFactory) {
    this.daoFactory = daoFactory;
  }

  public async getUser(authToken: string, alias: string): Promise<UserDto | null> {
    // TODO: Replace with the result of calling server
    const user = FakeData.instance.findUserByAlias(alias);
    return user == null ? null : UserMapper.toDto(user);
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: string,
    imageFileExtension: string
  ): Promise<[UserDto, string]> {
    // TODO: Replace with the result of calling the server
    const user = FakeData.instance.firstUser;
    if (user === null) {
      throw new Error("Invalid registration");
    }
    return [UserMapper.toDto(user), this.newAuthToken()];
  }

  public async login(alias: string, password: string): Promise<[UserDto, string]> {
    // TODO: Replace with the result of calling the server
    const user = FakeData.instance.firstUser;
    if (user === null) {
      throw new Error("Invalid alias or password");
    }
    return [UserMapper.toDto(user), this.newAuthToken()];
  }

  public async logout(authToken: string): Promise<void> {
    // Pause so we can see the logging out message. Delete when the call to the server is implemented.
    await new Promise((res) => setTimeout(res, 1000));
  }

  // Returns 10 digit random string
  private newAuthToken(): string {
    return Math.random().toString(36).substring(2, 17);
  }
}
