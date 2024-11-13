import {
  ChangeFollowStateRequest,
  ChangeFollowStateResponse,
  GetCountRequest,
  GetCountResponse,
  GetIsFollowerRequest,
  GetIsFollowerResponse,
  PagedUserItemRequest,
  PagedUserItemResponse,
  User,
  UserMapper,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
  private readonly SERVER_URL = "https://bsyiyzm2cb.execute-api.us-east-2.amazonaws.com/dev";

  private readonly endpoints = {
    followerList: "/follower/list",
    followeeList: "/followee/list",
    followerCount: "/follower/count",
    followeeCount: "/followee/count",
    isFollowing: "/follower/isfollowing",
    follow: "/follower/follow",
    unfollow: "/follower/unfollow",
    feedList: "/feed/list",
    storyList: "/story/list",
    statusUpload: "/status/upload",
    userGrab: "/user/grab",
    authRegister: "/auth/register",
    authLogin: "/auth/login",
    authLogout: "/auth/logout",
  };

  private clientCommunicator: ClientCommunicator;

  constructor() {
    this.clientCommunicator = this.getClientCommunicator();
  }

  private getClientCommunicator() {
    return new ClientCommunicator(this.SERVER_URL);
  }

  // FOLLOWSERVICE METHODS

  public async getIsFollowing(request: GetIsFollowerRequest): Promise<boolean> {
    const response = await this.clientCommunicator.doPost<GetIsFollowerRequest, GetIsFollowerResponse>(
      request,
      this.endpoints.isFollowing
    );

    if (response.success) {
      return response.isFollower;
    } else {
      throw new Error(response.message ?? "An unspecified error occurred");
    }
  }

  public async getMoreFollowers(request: PagedUserItemRequest): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<PagedUserItemRequest, PagedUserItemResponse>(
      request,
      this.endpoints.followerList
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

  public async getMoreFollowees(request: PagedUserItemRequest): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<PagedUserItemRequest, PagedUserItemResponse>(
      request,
      this.endpoints.followeeList
    );

    const items: User[] | null =
      response.success && response.items
        ? response.items.map((dto) => UserMapper.fromDto(dto) as User)
        : null;

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

  public async getCountFollower(request: GetCountRequest): Promise<number> {
    const response = await this.clientCommunicator.doPost<GetCountRequest, GetCountResponse>(
      request,
      this.endpoints.followerCount
    );

    if (response.success) {
      return response.count;
    } else {
      console.error(response);
      throw new Error(response.message ?? "An unspecified error occurred");
    }
  }

  public async getCountFollowee(request: GetCountRequest): Promise<number> {
    const response = await this.clientCommunicator.doPost<GetCountRequest, GetCountResponse>(
      request,
      this.endpoints.followeeCount
    );

    if (response.success) {
      return response.count;
    } else {
      console.error(response);
      throw new Error(response.message ?? "An unspecified error occurred");
    }
  }

  public async doFollow(request: ChangeFollowStateRequest): Promise<[number, number]> {
    const response = await this.clientCommunicator.doPost<
      ChangeFollowStateRequest,
      ChangeFollowStateResponse
    >(request, this.endpoints.follow);

    if (response.success) {
      return [response.countFollower, response.countFollowee];
    } else {
      throw new Error(response.message ?? "An unspecified error occurred");
    }
  }

  public async doUnfollow(request: ChangeFollowStateRequest): Promise<[number, number]> {
    const response = await this.clientCommunicator.doPost<
      ChangeFollowStateRequest,
      ChangeFollowStateResponse
    >(request, this.endpoints.unfollow);

    if (response.success) {
      return [response.countFollower, response.countFollowee];
    } else {
      throw new Error(response.message ?? "An unspecified error occurred");
    }
  }

  // USERSERVICE METHODS
}
