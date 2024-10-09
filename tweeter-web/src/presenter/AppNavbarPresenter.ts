import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface AppNavbarView {
  displayInfoStatement: (message: string, duration: number) => void;
  displayErrorStatement: (message: string) => void;
  clearLastMessage: () => void;
  clearInfoFromUser: () => void;
}

export class AppNavbarPresenter {
  private _view: AppNavbarView;
  private _userService: UserService;

  constructor(view: AppNavbarView) {
    this._view = view;
    this._userService = new UserService();
  }

  public async logOut(authToken: AuthToken) {
    this._view.displayInfoStatement("Logging Out...", 0);

    try {
      await this._userService.logout(authToken!);

      this._view.clearLastMessage();
      this._view.clearInfoFromUser();
    } catch (error) {
      this._view.displayErrorStatement(
        `Failed to log user out because of exception: ${error}`
      );
    }
  }
}
