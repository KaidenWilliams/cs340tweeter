import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { BasePresenter, MessageView } from "./BasePresenter";

export interface AppNavbarView extends MessageView {
  clearLastMessage: () => void;
}

export class AppNavbarPresenter extends BasePresenter<AppNavbarView> {
  private _userService: UserService;

  constructor(view: AppNavbarView) {
    super(view);
    this._userService = new UserService();
  }

  public async logOut(authToken: AuthToken) {
    const operation = async () => {
      this.view.displayInfoStatement("Logging Out...", 0);
      await this._userService.logout(authToken!);
      this.view.clearLastMessage();
      this.view.clearInfoFromUser();
    };

    const operationDescription = "log out user";

    await this.doFailureReportingOperation(operation, operationDescription);
  }
}
