import { DynamoDbDaoFactory } from "../../model/dao/daoFactory/DynamoDbDaoFactory";
import { FollowService } from "../../model/service/FollowService";
import { ChangeFollowStateRequest, ChangeFollowStateResponse } from "tweeter-shared";

export const handler = async (request: ChangeFollowStateRequest): Promise<ChangeFollowStateResponse> => {
  const followService = new FollowService(new DynamoDbDaoFactory());

  const [followerCount, followeeCount] = await followService.unfollow(request.token, request.user);

  return {
    success: true,
    message: null,
    countFollower: followerCount,
    countFollowee: followeeCount,
  };
};
