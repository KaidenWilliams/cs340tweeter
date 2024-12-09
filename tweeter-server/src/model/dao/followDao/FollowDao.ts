import { FollowEntity } from "../../entity/FollowEntity";

export interface FollowDao {
  //CRUD
  // GetFollowers + GetFollowees

  createFollow(followerHandle: string, followeeHandle: string): Promise<void>;

  getFollow(followerHandle: string, followeeHandle: string): Promise<FollowEntity | null>;

  getAllFolloweesCountForFollower(followerHandle: string): Promise<number>;

  getAllFollowersCountForFollowee(followeeHandle: string): Promise<number>;

  getAllFolloweesForFollowerPaginated(
    followerHandle: string,
    pageSize: number,
    lastAlias?: string
  ): Promise<{ followees: FollowEntity[]; hasMore: boolean }>;

  getAllFollowersForFolloweePaginated(
    followeeHandle: string,
    pageSize: number,
    lastAlias?: string
  ): Promise<{ followers: FollowEntity[]; hasMore: boolean }>;

  deleteFollow(followerHandle: string, followeeHandle: string): Promise<void>;
}
