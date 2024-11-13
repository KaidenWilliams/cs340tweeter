import { AuthToken, FakeData, Status } from "tweeter-shared";
import { ServerFacade } from "../api/ServerFacade";

export class StatusService {
  private serverFacade: ServerFacade;

  constructor() {
    this.serverFacade = this.getServerFacade();
  }

  private getServerFacade() {
    return new ServerFacade();
  }

  public async loadMoreFeedItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
  }

  public async loadMoreStoryItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
  }

  public async postStatus(authToken: AuthToken, newStatus: Status): Promise<void> {
    // TODO: Call the server to post the status
    // Pause so we can see the logging out message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));
  }
}
