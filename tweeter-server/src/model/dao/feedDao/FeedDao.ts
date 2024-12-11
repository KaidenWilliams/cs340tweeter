import { FeedEntity } from "../../entity/FeedEntity";

export interface FeedDao {
  // Create + Paged Read

  createFeed(feed: FeedEntity): Promise<void>;

  getFeedByAliasPaginated(
    followerAlias: string,
    pageSize: number,
    lastTimestamp?: number
  ): Promise<{ feeds: FeedEntity[]; hasMore: boolean }>;
}
