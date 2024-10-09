import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface LoginView {
  setLoading: (isLoading: boolean) => void;
  navigateToPage: (path: string) => void;
  updateUser: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean
  ) => void;
  displayErrorStatement: (message: string) => void;
}

export class LoginPresenter {
  private _view: LoginView;
  private _userService: UserService;

  constructor(view: LoginView) {
    this._view = view;
    this._userService = new UserService();
  }

  public isSubmitButtonValid(alias: string, password: string): boolean {
    return !!alias && !!password;
  }

  public async loginOnEnter(
    event: React.KeyboardEvent<HTMLElement>,
    alias: string,
    password: string,
    originalUrl: string | undefined,
    rememberMe: boolean
  ) {
    if (this.isSubmitButtonValid(alias, password)) {
      await this.login(originalUrl, alias, password, rememberMe);
    }
  }

  public async login(
    originalUrl: string | undefined,
    alias: string,
    password: string,
    rememberMe: boolean
  ) {
    try {
      this._view.setLoading(false);
      const [user, authToken] = await this._userService.login(alias, password);
      this._view.updateUser(user, user, authToken, rememberMe);

      if (!!originalUrl) {
        this._view.navigateToPage(originalUrl);
      } else {
        this._view.navigateToPage("/");
      }
    } catch (error) {
      this._view.displayErrorStatement(
        `Failed to log user in because of exception: ${error}`
      );
    } finally {
      this._view.setLoading(false);
    }
  }
}
