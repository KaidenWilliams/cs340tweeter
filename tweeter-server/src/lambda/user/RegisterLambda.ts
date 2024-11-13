import { RegisterRequest, SignInResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (request: RegisterRequest): Promise<SignInResponse> => {
  const userService = new UserService();
  const [foundUser, authToken] = await userService.register(
    request.firstName,
    request.lastName,
    request.alias,
    request.password,
    request.userImageBytes,
    request.imageFileExtension
  );

  return {
    user: foundUser,
    token: authToken,
  };
};
