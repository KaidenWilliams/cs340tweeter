import { DynamoDbDaoFactory } from "../../model/dao/daoFactory/DynamoDbDaoFactory";
import { FollowService } from "../../model/service/FollowService";
import { GetIsFollowerRequest, GetIsFollowerResponse } from "tweeter-shared";

export const handler = async (request: GetIsFollowerRequest): Promise<GetIsFollowerResponse> => {
  const followService = new FollowService(new DynamoDbDaoFactory());

  const isSelectedUserAFollower = await followService.getIsFollowerStatus(
    request.token,
    request.currentUser,
    request.selectedUser
  );

  return {
    success: true,
    message: null,
    isFollower: isSelectedUserAFollower,
  };
};
