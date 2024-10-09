import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface LoginView {
  setDisplayUser: (user: User) => void;
  displayErrorStatement: (message: string) => void;
}

export class LoginPresenter {
  private _view: LoginView;
  private _userService: UserService;

  constructor(view: LoginView) {
    this._view = view;
    this._userService = new UserService();
  }
}
