import { DynamoDbDaoFactory } from "../../model/dao/daoFactory/DynamoDbDaoFactory";
import { UserService } from "../../model/service/UserService";
import { LoginRequest, SignInResponse } from "tweeter-shared";

export const handler = async (request: LoginRequest): Promise<SignInResponse> => {
  const daoFactory = new DynamoDbDaoFactory();
  const userService = new UserService(daoFactory);

  const [foundUser, authToken] = await userService.login(request.alias, request.password);

  return {
    success: true,
    message: null,
    user: foundUser,
    token: authToken,
  };
};
