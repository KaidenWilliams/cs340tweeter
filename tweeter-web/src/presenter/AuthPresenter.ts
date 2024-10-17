import { AuthToken, User } from "tweeter-shared";
import { BasePresenter, BaseView } from "./BasePresenter";
import { UserService } from "../model/service/UserService";

export interface AuthView extends BaseView {
  updateUser: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean
  ) => void;
  setLoading: (isLoading: boolean) => void;
  navigateToPage: (url: string) => void;
}

export class AuthPresenter<T extends AuthView> extends BasePresenter<T> {
  private _userService: UserService;

  constructor(view: T) {
    super(view);
    this._userService = new UserService();
  }

  public get userService() {
    return this._userService;
  }

  public async doAuthFunction(
    authOperation: () => Promise<[User, AuthToken]>,
    url: string,
    rememberMe: boolean,
    operationDescription: string
  ) {
    this.view.setLoading(false);

    const operation = async () => {
      const [user, authToken] = await authOperation();
      this.view.updateUser(user, user, authToken, rememberMe);
      this.view.navigateToPage(url);
    };

    await this.doFailureReportingOperation(operation, operationDescription);

    this.view.setLoading(false);
  }
}
