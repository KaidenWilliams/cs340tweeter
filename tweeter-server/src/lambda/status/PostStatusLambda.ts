import { DynamoDbDaoFactory } from "../../model/dao/daoFactory/DynamoDbDaoFactory";
import { StatusService } from "../../model/service/StatusService";
import { PostStatusRequest, TweeterResponse } from "tweeter-shared";

export const handler = async (request: PostStatusRequest): Promise<TweeterResponse> => {
  const statusService = new StatusService(new DynamoDbDaoFactory());

  await statusService.postStatus(request.token, request.newStatus);

  return {
    success: true,
    message: null,
  };
};
