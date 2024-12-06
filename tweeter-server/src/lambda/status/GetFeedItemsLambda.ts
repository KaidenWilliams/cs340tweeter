import { DynamoDbDaoFactory } from "../../model/dao/daoFactory/DynamoDbDaoFactory";
import { StatusService } from "../../model/service/StatusService";
import { PagedStatusItemRequest, PagedStatusItemResponse } from "tweeter-shared";

export const handler = async (request: PagedStatusItemRequest): Promise<PagedStatusItemResponse> => {
  const daoFactory = new DynamoDbDaoFactory();
  const statusService = new StatusService(daoFactory);

  const [items, hasMore] = await statusService.loadMoreFeedItems(
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
