import { AuthPresenter, AuthView } from "./AuthPresenter";

export interface LoginView extends AuthView {}

export class LoginPresenter extends AuthPresenter<LoginView> {
  constructor(view: LoginView) {
    super(view);
  }

  public async login(
    originalUrl: string | undefined,
    alias: string,
    password: string,
    rememberMe: boolean
  ) {
    const authOperation = async () => {
      return await this.userService.login(alias, password);
    };

    const url = originalUrl ?? "/";
    const operationDescription = "log user in";

    await this.doAuthFunction(
      authOperation,
      url,
      rememberMe,
      operationDescription
    );
  }
}
