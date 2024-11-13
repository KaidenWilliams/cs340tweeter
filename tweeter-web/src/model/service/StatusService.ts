import { AuthToken, FakeData, Status, StatusMapper } from "tweeter-shared";
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
    const request = {
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem ? StatusMapper.toDto(lastItem) : null,
    };

    return await this.serverFacade.getFeedItems(request);
  }

  public async loadMoreStoryItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    const request = {
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem ? StatusMapper.toDto(lastItem) : null,
    };

    return await this.serverFacade.getStoryItems(request);
  }

  public async postStatus(authToken: AuthToken, newStatus: Status): Promise<void> {
    const request = {
      token: authToken.token,
      newStatus: StatusMapper.toDto(newStatus),
    };

    await this.serverFacade.createStatus(request);
  }
}
