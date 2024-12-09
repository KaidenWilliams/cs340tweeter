import { StoryEntity } from "../../entity/StoryEntity";

export interface StoryDao {
  // Create + Read

  createStory(story: StoryEntity): Promise<void>;

  getStoriesByAliasPaginated(
    alias: string,
    pageSize: number,
    lastTimestamp?: number
  ): Promise<{ stories: StoryEntity[]; hasMore: boolean }>;
}
