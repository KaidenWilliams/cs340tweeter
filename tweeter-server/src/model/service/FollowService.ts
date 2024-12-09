import { FakeData, UserDto, UserMapper } from "tweeter-shared";
import { DaoFactory } from "../dao/daoFactory/DaoFactory";
import { AuthService } from "./AuthService";

export class FollowService {
  private readonly authService;

  private readonly followDao;
  private readonly userDAO;

  constructor(daoFactory: DaoFactory) {
    this.authService = new AuthService(daoFactory);
    this.followDao = daoFactory.createFollowDao();
    this.userDAO = daoFactory.createUserDao();
  }

  public async loadMoreFollowers(
    authToken: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    await this.authService.EnsureValidAuthTokenThrowsError(authToken);

    const { followers, hasMore } = await this.followDao.getAllFollowersForFolloweePaginated(
      userAlias,
      pageSize,
      lastItem ? lastItem.alias : undefined
    );

    const followee_list = [];

    for (var follower of followers) {
      const user = await this.userDAO.getUser(follower.followerHandle);
      if (user == null) continue;

      const userDto = {
        firstName: user.firstName,
        lastName: user.lastName,
        alias: user.alias,
        imageUrl: user.imageUrl,
      };

      followee_list.push(userDto);
    }

    return [followee_list, hasMore];
  }

  public async loadMoreFollowees(
    authToken: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    await this.authService.EnsureValidAuthTokenThrowsError(authToken);

    const { followees, hasMore } = await this.followDao.getAllFolloweesForFollowerPaginated(
      userAlias,
      pageSize,
      lastItem ? lastItem.alias : undefined
    );

    const followee_list = [];

    for (var followee of followees) {
      const user = await this.userDAO.getUser(followee.followeeHandle);
      if (user == null) continue;

      const userDto = {
        firstName: user.firstName,
        lastName: user.lastName,
        alias: user.alias,
        imageUrl: user.imageUrl,
      };

      followee_list.push(userDto);
    }

    return [followee_list, hasMore];
  }

  public async follow(
    authToken: string,
    userToFollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    const currentUserAlias = await this.authService.EnsureValidAuthTokenThrowsError(authToken);

    await this.followDao.createFollow(currentUserAlias, userToFollow.alias);

    const followerCount = await this.getFollowerCount(authToken, userToFollow);
    const followeeCount = await this.getFolloweeCount(authToken, userToFollow);

    return [followerCount, followeeCount];
  }

  public async unfollow(
    authToken: string,
    userToUnfollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    const currentUserAlias = await this.authService.EnsureValidAuthTokenThrowsError(authToken);

    await this.followDao.deleteFollow(currentUserAlias, userToUnfollow.alias);

    const followerCount = await this.getFollowerCount(authToken, userToUnfollow);
    const followeeCount = await this.getFolloweeCount(authToken, userToUnfollow);

    return [followerCount, followeeCount];
  }

  // GET ALL THE PEOPLE WHO ARE FOLLOWING YOU
  public async getFollowerCount(authToken: string, user: UserDto): Promise<number> {
    await this.authService.EnsureValidAuthTokenThrowsError(authToken);

    const items = await this.followDao.getAllFollowersForFollowee(user.alias);
    return items ? items.length : 0;
  }

  // FOLLOWEE IS SYNONYMOUS WITH FOLLOWING. PEOPLE YOU ARE FOLLOWING
  // GET ALL THE PEOPLE YOU ARE FOLLOWING

  public async getFolloweeCount(authToken: string, user: UserDto): Promise<number> {
    await this.authService.EnsureValidAuthTokenThrowsError(authToken);

    const items = await this.followDao.getAllFolloweesForFollower(user.alias);
    return items ? items.length : 0;
  }

  public async getIsFollowerStatus(
    authToken: string,
    user: UserDto,
    selectedUser: UserDto
  ): Promise<boolean> {
    await this.authService.EnsureValidAuthTokenThrowsError(authToken);

    // does User follow selectedUser
    // 1. followerHandle, 2. followeeHandle
    const followRow = await this.followDao.getFollow(user.alias, selectedUser.alias);
    if (followRow == null) {
      return false;
    }
    return true;
  }
}
