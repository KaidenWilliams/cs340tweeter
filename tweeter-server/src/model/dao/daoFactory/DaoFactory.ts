import { AuthDao } from "../authDao/AuthDao";
import { FeedDao } from "../feedDao/FeedDao";
import { FollowDao } from "../followDao/FollowDao";
import { PhotoDao } from "../photoDao/PhotoDao";
import { StoryDao } from "../storyDao/StoryDao";
import { UserDao } from "../userDao/UserDao";

export interface DaoFactory {
  createFollowDao(): FollowDao;
  createUserDao(): UserDao;
  createFeedDao(): FeedDao;
  createStoryDao(): StoryDao;
  createAuthDao(): AuthDao;
  createPhotoDao(): PhotoDao;
}
