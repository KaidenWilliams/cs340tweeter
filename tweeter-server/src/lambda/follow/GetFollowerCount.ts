import { FollowService } from "../../model/service/FollowService";
import { GetUserCountRequest, GetUserCountResponse } from "tweeter-shared";

export const handler = async (request: GetUserCountRequest): Promise<GetUserCountResponse> => {
  const followService = new FollowService();
  const followerCount = await followService.getFollowerCount(request.token, request.user);

  return {
    success: true,
    message: null,
    count: followerCount,
  };
};
