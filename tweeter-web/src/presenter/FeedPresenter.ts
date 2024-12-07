import { AuthToken, Status } from "tweeter-shared";
import { StatusItemPresenter } from "./StatusItemPresenter";
import { PAGE_SIZE } from "./PageItemPresenter";

export class FeedPresenter extends StatusItemPresenter {
  protected async getMoreItems(authToken: AuthToken, userAlias: string): Promise<[Status[], boolean]> {
    const operation = async () => {
      return await this.service.loadMoreFeedItems(authToken, userAlias, PAGE_SIZE, this.lastItem);
    };

    return await this.doAnyOperation(operation);
  }

  protected getItemDescription(): string {
    return "load feed items";
  }
}
