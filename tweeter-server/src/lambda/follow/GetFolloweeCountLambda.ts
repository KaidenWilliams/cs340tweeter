import { DynamoDbDaoFactory } from "../../model/dao/daoFactory/DynamoDbDaoFactory";
import { FollowService } from "../../model/service/FollowService";
import { GetCountRequest, GetCountResponse } from "tweeter-shared";

export const handler = async (request: GetCountRequest): Promise<GetCountResponse> => {
  const daoFactory = new DynamoDbDaoFactory();
  const followService = new FollowService(daoFactory);

  const followeeCount = await followService.getFolloweeCount(request.token, request.user);

  return {
    success: true,
    message: null,
    count: followeeCount,
  };
};
