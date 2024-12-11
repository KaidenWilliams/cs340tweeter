import { DynamoDbDaoFactory } from "../../model/dao/daoFactory/DynamoDbDaoFactory";
import { StatusService } from "../../model/service/StatusService";
import { PostStatusRequest, TweeterResponse } from "tweeter-shared";

export const handler = async (request: PostStatusRequest): Promise<TweeterResponse> => {
  const daoFactory = new DynamoDbDaoFactory();

  const statusService = new StatusService(daoFactory);

  await statusService.postStatus(request.token, request.newStatus);

  return {
    success: true,
    message: null,
  };
};
