// TODO KAIDEN need to implement 10 functions here

import { AuthToken, Status } from "tweeter-shared";

export class UserService {
  //1
  public async postStatus(
    authToken: AuthToken,
    newStatus: Status
  ): Promise<void> {
    // TODO: Call the server to post the status
    // Pause so we can see the logging out message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));
  }
}
