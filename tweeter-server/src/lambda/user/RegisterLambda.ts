import { RegisterRequest, SignInResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDbDaoFactory } from "../../model/dao/daoFactory/DynamoDbDaoFactory";

export const handler = async (request: RegisterRequest): Promise<SignInResponse> => {
  const userService = new UserService(new DynamoDbDaoFactory());

  const [foundUser, authToken] = await userService.register(
    request.firstName,
    request.lastName,
    request.alias,
    request.password,
    request.userImageBytes,
    request.imageFileExtension
  );

  return {
    success: true,
    message: null,
    user: foundUser,
    token: authToken,
  };
};
