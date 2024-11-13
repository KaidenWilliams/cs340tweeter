import { FollowService } from "../../model/service/FollowService";
import { GetCountRequest, GetCountResponse } from "tweeter-shared";

export const handler = async (request: GetCountRequest): Promise<GetCountResponse> => {
  const followService = new FollowService();
  const followeeCount = await followService.getFolloweeCount(request.token, request.user);

  return {
    success: true,
    message: null,
    count: followeeCount,
  };
};
