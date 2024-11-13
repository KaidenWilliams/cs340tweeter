import { StatusService } from "../../model/service/StatusService";
import { PostStatusRequest } from "tweeter-shared";

export const handler = async (request: PostStatusRequest): Promise<void> => {
  const statusService = new StatusService();
  await statusService.postStatus(request.token, request.newStatus);
};
