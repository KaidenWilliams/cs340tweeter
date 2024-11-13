import { AuthToken, FakeData, User, UserMapper } from "tweeter-shared";
import { ServerFacade } from "../api/ServerFacade";

export class FollowService {
  private serverFacade: ServerFacade;

  constructor() {
    this.serverFacade = this.getServerFacade();
  }

  private getServerFacade() {
    return new ServerFacade();
  }

  public async getIsFollower(authToken: AuthToken, user: User, selectedUser: User): Promise<boolean> {
    const request = {
      token: authToken.token,
      currentUser: UserMapper.toDto(user),
      selectedUser: UserMapper.toDto(selectedUser),
    };

    return await this.serverFacade.getIsFollowing(request);
  }

  public async getFollowerCount(authToken: AuthToken, user: User): Promise<number> {
    const request = {
      token: authToken.token,
      user: UserMapper.toDto(user),
    };

    return this.serverFacade.getCountFollower(request);
  }

  public async getFolloweeCount(authToken: AuthToken, user: User): Promise<number> {
    const request = {
      token: authToken.token,
      user: UserMapper.toDto(user),
    };

    return this.serverFacade.getCountFollowee(request);
  }

  public async loadMoreFollowers(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    const request = {
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem,
    };

    const result = this.serverFacade.getMoreFollowers(request);
    return result;
  }

  public async loadMoreFollowees(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    const request = {
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem,
    };

    const result = this.serverFacade.getMoreFollowees(request);
    return result;
  }

  public async follow(
    authToken: AuthToken,
    userToFollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    const request = {
      token: authToken.token,
      user: UserMapper.toDto(userToFollow),
    };

    return await this.serverFacade.doFollow(request);
  }

  public async unfollow(
    authToken: AuthToken,
    userToFollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    const request = {
      token: authToken.token,
      user: UserMapper.toDto(userToFollow),
    };

    return await this.serverFacade.doUnfollow(request);
  }
}
