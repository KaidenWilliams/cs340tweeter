import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface UserNavigationHookView {
  setDisplayUser: (user: User) => void;
  displayErrorStatement: (message: string) => void;
}

export class UserNavigationHookPresenter {
  private _view: UserNavigationHookView;
  private _userService: UserService;

  constructor(view: UserNavigationHookView) {
    this._view = view;
    this._userService = new UserService();
  }

  public async navigateToUser(
    currentUser: User,
    target: string,
    authToken: AuthToken
  ): Promise<void> {
    try {
      const alias = this.extractAlias(target);
      const user = await this._userService.getUser(authToken, alias);

      if (!!user) {
        if (currentUser.equals(user)) {
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

  public extractAlias(value: string): string {
    const index = value.indexOf("@");
    return value.substring(index);
  }
}
