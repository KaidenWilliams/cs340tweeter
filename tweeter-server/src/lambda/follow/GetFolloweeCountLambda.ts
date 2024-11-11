import { FollowService } from "../../model/service/FollowService";
import { GetUserCountRequest, GetUserCountResponse } from "tweeter-shared";

export const handler = async (request: GetUserCountRequest): Promise<GetUserCountResponse> => {
  const followService = new FollowService();
  const followeeCount = await followService.getFolloweeCount(request.token, request.user);

  return {
    success: true,
    message: null,
    count: followeeCount,
  };
};
