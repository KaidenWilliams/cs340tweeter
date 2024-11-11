import { FollowService } from "../../model/service/FollowService";
import { ChangeFollowStateRequest, ChangeFollowStateResponse } from "tweeter-shared";

export const handler = async (request: ChangeFollowStateRequest): Promise<ChangeFollowStateResponse> => {
  const followService = new FollowService();
  const [followerCount, followeeCount] = await followService.follow(request.token, request.user);

  return {
    success: true,
    message: null,
    countFollower: followerCount,
    countFollowee: followeeCount,
  };
};
