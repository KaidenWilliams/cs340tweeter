import { FakeData, StatusDto, StatusMapper, UserDto } from "tweeter-shared";
import { DaoFactory } from "../dao/daoFactory/DaoFactory";
import { AuthService } from "./AuthService";
import { StoryEntity } from "../entity/StoryEntity";
import { FeedEntity } from "../entity/FeedEntity";

export class StatusService {
  private readonly authService;

  private readonly storyDao;
  private readonly feedDao;
  private readonly userDao;
  private readonly followDao;

  constructor(daoFactory: DaoFactory) {
    this.authService = new AuthService(daoFactory);
    this.storyDao = daoFactory.createStoryDao();
    this.feedDao = daoFactory.createFeedDao();
    this.userDao = daoFactory.createUserDao();
    this.followDao = daoFactory.createFollowDao();
  }

  public async loadMoreFeedItems(
    authToken: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    await this.authService.EnsureValidAuthTokenThrowsError(authToken);

    const { feeds, hasMore } = await this.feedDao.getFeedByAliasPaginated(
      userAlias,
      pageSize,
      lastItem ? lastItem.timestamp : undefined
    );

    const status_list = [];

    for (var feed of feeds) {
      const user = await this.userDao.getUser(feed.posterAlias);
      if (user == null) continue;

      const userDto: UserDto = {
        firstName: user.firstName,
        lastName: user.lastName,
        alias: user.alias,
        imageUrl: user.imageUrl,
      };

      const statusDto: StatusDto = {
        userDto: userDto,
        timestamp: feed.timestamp,
        post: feed.post,
      };

      status_list.push(statusDto);
    }

    return [status_list, hasMore];
  }

  public async loadMoreStoryItems(
    authToken: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    await this.authService.EnsureValidAuthTokenThrowsError(authToken);

    const { stories, hasMore } = await this.storyDao.getStoriesByAliasPaginated(
      userAlias,
      pageSize,
      lastItem ? lastItem.timestamp : undefined
    );

    const user = await this.userDao.getUser(userAlias);

    const status_list = [];

    for (var story of stories) {
      if (user == null) continue;

      const userDto: UserDto = {
        firstName: user.firstName,
        lastName: user.lastName,
        alias: user.alias,
        imageUrl: user.imageUrl,
      };

      const statusDto: StatusDto = {
        userDto: userDto,
        timestamp: story.timestamp,
        post: story.post,
      };

      status_list.push(statusDto);
    }

    return [status_list, hasMore];
  }

  public async postStatus(authToken: string, newStatus: StatusDto): Promise<void> {
    await this.authService.EnsureValidAuthTokenThrowsError(authToken);

    // Create story
    const storyEntity = new StoryEntity(newStatus.userDto.alias, newStatus.timestamp, newStatus.post);
    await this.storyDao.createStory(storyEntity);

    // Put in feed
    const followEntities = await this.followDao.getAllFollowersForFollowee(newStatus.userDto.alias);

    for (const followEntity of followEntities) {
      const feedEntity = new FeedEntity(
        followEntity.followerHandle,
        newStatus.userDto.alias,
        newStatus.timestamp,
        newStatus.post
      );
      await this.feedDao.createStory(feedEntity);
    }

    return;
  }
}
