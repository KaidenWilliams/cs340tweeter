import {
  AuthToken,
  ChangeFollowStateRequest,
  ChangeFollowStateResponse,
  GetCountRequest,
  GetCountResponse,
  GetIsFollowerRequest,
  GetIsFollowerResponse,
  GetUserRequest,
  GetUserResponse,
  LoginRequest,
  LogoutRequest,
  PagedStatusItemRequest,
  PagedStatusItemResponse,
  PagedUserItemRequest,
  PagedUserItemResponse,
  PostStatusRequest,
  RegisterRequest,
  SignInResponse,
  Status,
  StatusMapper,
  TweeterResponse,
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
    isFollowing: "/user/isfollowing",
    follow: "/user/follow",
    unfollow: "/user/unfollow",
    userGrab: "/user/grab",
    authRegister: "/auth/register",
    authLogin: "/auth/login",
    authLogout: "/auth/logout",
    feedList: "/feed/list",
    storyList: "/story/list",
    statusUpload: "/status/upload",
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
    console.log("1. CALLED GetIsFollowing");

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
    console.log("2. CALLED GetMoreFollowers");

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
    console.log("3. CALLED GetMoreFollowees");
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
    console.log("4. CALLED GetCountFollower");
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
    console.log("5. CALLED GetCountFollowee");
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
    console.log("6. CALLED DoFollow");
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
    console.log("7. CALLED DoUnfollow");
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
  public async grabUser(request: GetUserRequest): Promise<User | null> {
    console.log("8. CALLED GrabUser");
    const response = await this.clientCommunicator.doPost<GetUserRequest, GetUserResponse>(
      request,
      this.endpoints.userGrab
    );

    if (response.success) {
      return response.user ? UserMapper.fromDto(response.user) : null;
    } else {
      throw new Error(response.message ?? "An unspecified error occurred");
    }
  }

  public async doRegister(request: RegisterRequest): Promise<[User, AuthToken]> {
    console.log("9. CALLED DoRegister");
    const response = await this.clientCommunicator.doPost<RegisterRequest, SignInResponse>(
      request,
      this.endpoints.authRegister
    );

    if (response.success) {
      const user = UserMapper.fromDto(response.user);
      const authToken = new AuthToken(response.token, Date.now());
      return [user!, authToken];
    } else {
      throw new Error(response.message ?? "An unspecified error occurred");
    }
  }

  public async doLogin(request: LoginRequest): Promise<[User, AuthToken]> {
    console.log("10. CALLED DoLogin");
    const response = await this.clientCommunicator.doPost<LoginRequest, SignInResponse>(
      request,
      this.endpoints.authLogin
    );

    if (response.success) {
      const user = UserMapper.fromDto(response.user);
      const authToken = new AuthToken(response.token, Date.now());
      return [user!, authToken];
    } else {
      throw new Error(response.message ?? "An unspecified error occurred");
    }
  }

  public async doLogout(request: LogoutRequest): Promise<void> {
    console.log("11. CALLED DoLogout");
    const response = await this.clientCommunicator.doPost<LogoutRequest, TweeterResponse>(
      request,
      this.endpoints.authLogout
    );

    if (!response.success) {
      throw new Error(response.message ?? "An unspecified error occurred");
    }
  }

  // STATUSSERVICE METHODS

  public async getFeedItems(request: PagedStatusItemRequest): Promise<[Status[], boolean]> {
    console.log("12. CALLED GetFeedItems");
    const response = await this.clientCommunicator.doPost<PagedStatusItemRequest, PagedStatusItemResponse>(
      request,
      this.endpoints.feedList
    );

    if (response.success) {
      const items: Status[] | null = response.items
        ? response.items.map((dto) => StatusMapper.fromDto(dto)!)
        : null;

      if (items == null) {
        throw new Error(`No feed items found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      throw new Error(response.message ?? "An unspecified error occurred");
    }
  }

  public async getStoryItems(request: PagedStatusItemRequest): Promise<[Status[], boolean]> {
    console.log("13. CALLED GetStoryItems");
    const response = await this.clientCommunicator.doPost<PagedStatusItemRequest, PagedStatusItemResponse>(
      request,
      this.endpoints.storyList
    );

    if (response.success) {
      const items: Status[] | null = response.items
        ? response.items.map((dto) => StatusMapper.fromDto(dto)!)
        : null;

      if (items == null) {
        throw new Error(`No feed items found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      throw new Error(response.message ?? "An unspecified error occurred");
    }
  }

  public async createStatus(request: PostStatusRequest): Promise<void> {
    console.log("14. CALLED CreateStatus");
    const response = await this.clientCommunicator.doPost<PostStatusRequest, TweeterResponse>(
      request,
      this.endpoints.statusUpload
    );

    if (!response.success) {
      throw new Error(response.message ?? "An unspecified error occurred");
    }
  }
}
