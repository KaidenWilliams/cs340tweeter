import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { BasePresenter, BaseView } from "./BasePresenter";

export interface DisplayUserView extends BaseView {
  setDisplayUser: (user: User) => void;
}

export class DisplayUserPresenter extends BasePresenter<DisplayUserView> {
  private _userService: UserService;

  constructor(view: DisplayUserView) {
    super(view);
    this._userService = new UserService();
  }

  public async displayUser(
    target: string,
    currentUser: User | null,
    authToken: AuthToken
  ) {
    const operation = async () => {
      const alias = this.extractAlias(target);
      const user = await this._userService.getUser(authToken, alias);

      if (!!user) {
        if (currentUser!.equals(user)) {
          this.view.setDisplayUser(currentUser!);
        } else {
          this.view.setDisplayUser(user);
        }
      }
    };

    const operationDescription = "get user";
    await this.doFailureReportingOperation(operation, operationDescription);
  }

  private extractAlias(value: string): string {
    const index = value.indexOf("@");
    return value.substring(index);
  }
}
