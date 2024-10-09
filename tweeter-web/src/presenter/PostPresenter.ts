import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface PostView {
  setDisplayUser: (user: User) => void;
  displayErrorStatement: (message: string) => void;
}

export class PostPresenter {
  private _view: PostView;
  private _userService: UserService;

  constructor(view: PostView) {
    this._view = view;
    this._userService = new UserService();
  }

  public async getUser(
    aliasToExtract: string,
    currentUser: User | null,
    authToken: AuthToken
  ) {
    try {
      const alias = this.extractAlias(aliasToExtract);
      const user = await this._userService.getUser(authToken!, alias);

      if (!!user) {
        if (currentUser!.equals(user)) {
          this._view.setDisplayUser(currentUser!);
        } else {
          this._view.setDisplayUser(user);
        }
      }
    } catch (error) {
      this._view.displayErrorStatement(
        `Failed to get user because of exception: ${error}`
      );
    }
  }

  private extractAlias(value: string): string {
    const index = value.indexOf("@");
    return value.substring(index);
  }
}
