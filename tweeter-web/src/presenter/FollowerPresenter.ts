import { AuthToken, User } from "tweeter-shared";
import { UserItemPresenter } from "./UserItemPresenter";
import { PAGE_SIZE } from "./PageItemPresenter";

export class FollowerPresenter extends UserItemPresenter {
  protected async getMoreItems(authToken: AuthToken, userAlias: string): Promise<[User[], boolean]> {
    const operation = async () => {
      return await this.service.loadMoreFollowers(authToken, userAlias, PAGE_SIZE, this.lastItem);
    };

    return await this.doAnyOperation(operation);
  }

  protected getItemDescription(): string {
    return "load followers";
  }
}
