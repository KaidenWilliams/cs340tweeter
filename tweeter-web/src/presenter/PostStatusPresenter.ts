import { AuthToken, Status, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface PostStatusView {
  changePost: (post: string) => void;
  displayInfoStatement: (message: string, duration: number) => void;
  displayErrorStatement: (message: string) => void;
  clearInfoMessage: () => void;
}

export class PostStatusPresenter {
  private _view: PostStatusView;
  private _userService: UserService;

  constructor(view: PostStatusView) {
    this._view = view;
    this._userService = new UserService();
  }

  public async postStatus(
    post: string,
    currentUser: User | null,
    authToken: AuthToken
  ): Promise<void> {
    try {
      this._view.displayInfoStatement("Posting status...", 0);
      const status = new Status(post, currentUser!, Date.now());
      await this._userService.postStatus(authToken!, status);

      this._view.changePost("");
      this._view.displayInfoStatement("Status posted!", 2000);
    } catch (error) {
      this._view.displayErrorStatement(
        `Failed to post the status because of exception: ${error}`
      );
    }
    this._view.clearInfoMessage();
  }
}
