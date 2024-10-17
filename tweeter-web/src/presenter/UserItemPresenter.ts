import { User } from "tweeter-shared";
import { PagedItemView, PageItemPresenter } from "./PageItemPresenter";
import { FollowService } from "../model/service/FollowService";

export abstract class UserItemPresenter extends PageItemPresenter<
  User,
  FollowService
> {
  public constructor(view: PagedItemView<User>) {
    super(view, new FollowService());
  }
}
