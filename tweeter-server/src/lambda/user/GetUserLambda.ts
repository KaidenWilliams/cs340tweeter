import { DynamoDbDaoFactory } from "../../model/dao/daoFactory/DynamoDbDaoFactory";
import { UserService } from "../../model/service/UserService";
import { GetUserRequest, GetUserResponse } from "tweeter-shared";

export const handler = async (request: GetUserRequest): Promise<GetUserResponse> => {
  const daoFactory = new DynamoDbDaoFactory();
  const userService = new UserService(daoFactory);

  const foundUser = await userService.getUser(request.token, request.alias);

  return {
    success: true,
    message: null,
    user: foundUser,
  };
};
