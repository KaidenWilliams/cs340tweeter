import { PagedUserItemRequest, PagedUserItemResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { DynamoDbDaoFactory } from "../../model/dao/daoFactory/DynamoDbDaoFactory";

export const handler = async (request: PagedUserItemRequest): Promise<PagedUserItemResponse> => {
  const daoFactory = new DynamoDbDaoFactory();
  const followService = new FollowService(daoFactory);

  const [items, hasMore] = await followService.loadMoreFollowees(
    request.token,
    request.userAlias,
    request.pageSize,
    request.lastItem
  );

  return {
    success: true,
    message: null,
    items: items,
    hasMore: hasMore,
  };
};
