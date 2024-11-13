import { UserService } from "../../model/service/UserService";
import { LoginRequest, SignInResponse } from "tweeter-shared";

export const handler = async (request: LoginRequest): Promise<SignInResponse> => {
  const userService = new UserService();
  const [foundUser, authToken] = await userService.login(request.alias, request.password);

  return {
    success: true,
    message: null,
    user: foundUser,
    token: authToken,
  };
};
