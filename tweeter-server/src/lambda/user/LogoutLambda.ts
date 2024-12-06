import { LogoutRequest, TweeterResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDbDaoFactory } from "../../model/dao/daoFactory/DynamoDbDaoFactory";

export const handler = async (request: LogoutRequest): Promise<TweeterResponse> => {
  const daoFactory = new DynamoDbDaoFactory();
  const userService = new UserService(daoFactory);

  await userService.logout(request.token);

  return {
    success: true,
    message: null,
  };
};
