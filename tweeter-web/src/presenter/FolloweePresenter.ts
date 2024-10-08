import { AuthToken } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { UserItemPresenter, UserItemView } from "./UserItemPresenter";

export const PAGE_SIZE = 10;

export class FolloweePresenter extends UserItemPresenter {
  private followService: FollowService;

  constructor(view: UserItemView) {
    // Has a reference to the View, which it can call through it's callbacks
    super(view);
    // Also has an instance of a service that it can call to get data
    this.followService = new FollowService();
  }

  // loadMoreItems method, which is called by the
  public async loadMoreItems(authToken: AuthToken, userAlias: string) {
    try {
      const [newItems, hasMore] = await this.followService.loadMoreFollowees(
        authToken,
        userAlias,
        PAGE_SIZE,
        this.lastItem
      );

      this.hasMoreItems = hasMore;
      this.lastItem = newItems[newItems.length - 1];
      this.view.addItems(newItems);
    } catch (error) {
      this.view.displayErrorStatement(
        `Failed to load followees because of exception: ${error}`
      );
    }
  }
}
