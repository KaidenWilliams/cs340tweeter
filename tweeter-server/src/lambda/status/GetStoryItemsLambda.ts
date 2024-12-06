import { DynamoDbDaoFactory } from "../../model/dao/daoFactory/DynamoDbDaoFactory";
import { StatusService } from "../../model/service/StatusService";
import { PagedStatusItemRequest, PagedStatusItemResponse } from "tweeter-shared";

export const handler = async (request: PagedStatusItemRequest): Promise<PagedStatusItemResponse> => {
  const statusService = new StatusService(new DynamoDbDaoFactory());

  const [items, hasMore] = await statusService.loadMoreStoryItems(
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
