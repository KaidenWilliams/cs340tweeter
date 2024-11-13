// TODO KAIDEN need to implement 10 functions here

import { Buffer } from "buffer";
import { FakeData, UserDto } from "tweeter-shared";

export class UserService {
  public async getUser(authToken: string, alias: string): Promise<UserDto | null> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.findUserByAlias(alias);
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[UserDto, string]> {
    // Not neded now, but will be needed when you make the request to the server in milestone 3
    const imageStringBase64: string = Buffer.from(userImageBytes).toString("base64");

    // TODO: Replace with the result of calling the server
    const user = FakeData.instance.firstUser;
    if (user === null) {
      throw new Error("Invalid registration");
    }
    return [user, this.newAuthToken()];
  }

  public async login(alias: string, password: string): Promise<[UserDto, string]> {
    // TODO: Replace with the result of calling the server
    const user = FakeData.instance.firstUser;
    if (user === null) {
      throw new Error("Invalid alias or password");
    }
    return [user, this.newAuthToken()];
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
