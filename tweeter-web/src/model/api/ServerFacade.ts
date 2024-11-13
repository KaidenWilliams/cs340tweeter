import { PagedUserItemRequest, PagedUserItemResponse, User, UserMapper } from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
  // TODO MAYBE PUT THIS IN A SECRETS FILE
  private SERVER_URL = "https://bsyiyzm2cb.execute-api.us-east-2.amazonaws.com/dev";

  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  public async getMoreFollowees(request: PagedUserItemRequest): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<PagedUserItemRequest, PagedUserItemResponse>(
      request,
      "/followee/list"
    );

    // Convert the UserDto array returned by ClientCommunicator to a User array
    const items: User[] | null =
      response.success && response.items
        ? response.items.map((dto) => UserMapper.fromDto(dto) as User)
        : null;

    // Handle errors
    if (response.success) {
      if (items == null) {
        throw new Error(`No followees found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? "An unspecified error occurred");
    }
  }

  public async getMoreFollowers(request: PagedUserItemRequest): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<PagedUserItemRequest, PagedUserItemResponse>(
      request,
      "/followers/list"
    );

    // Convert the UserDto array returned by ClientCommunicator to a User array
    const items: User[] | null =
      response.success && response.items
        ? response.items.map((dto) => UserMapper.fromDto(dto) as User)
        : null;

    // Handle errors
    if (response.success) {
      if (items == null) {
        throw new Error(`No followers found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? "An unspecified error occurred");
    }
  }

  // 1. /followee/list
  // 2. /follower/list
  // 3. /followee/count
  // 4. /follower/count
  // 5. /follower/isfollowing
  // 6. /follower/follow
  // 7. /follower/unfollow
  // 8. /feed/list
  // 9. /story/list
  // 10. /status/upload
  // 11. /user/grab
  // 12. /auth/register
  // 13. /auth/login
  // 14. /auth/logout
}
