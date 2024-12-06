import { FakeData, StatusDto, StatusMapper } from "tweeter-shared";
import { DaoFactory } from "../dao/daoFactory/DaoFactory";

export class StatusService {
  private readonly daoFactory: DaoFactory;

  constructor(daoFactory: DaoFactory) {
    this.daoFactory = daoFactory;
  }

  public async loadMoreFeedItems(
    authToken: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    // TODO: Replace with the result of calling server
    return this.getFakePageItems(lastItem, pageSize);
  }

  public async loadMoreStoryItems(
    authToken: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    // TODO: Replace with the result of calling server
    return this.getFakePageItems(lastItem, pageSize);
  }

  private async getFakePageItems(
    lastItem: StatusDto | null,
    pageSize: number
  ): Promise<[StatusDto[], boolean]> {
    const [items, hasMore] = FakeData.instance.getPageOfStatuses(StatusMapper.fromDto(lastItem), pageSize);
    const dtos = items.map((user) => StatusMapper.toDto(user));
    return [dtos, hasMore];
  }

  public async postStatus(authToken: string, newStatus: StatusDto): Promise<void> {
    // TODO: Call the server to post the status
    // Pause so we can see the logging out message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));
  }
}
