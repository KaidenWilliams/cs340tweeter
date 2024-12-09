import { DynamoDBDocumentClient, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { FeedDao } from "./FeedDao";
import { FeedEntity } from "../../entity/FeedEntity";

// Create + Paged Read

export class DynamoDbFeedDao implements FeedDao {
  readonly tableName = "feed";

  readonly followerAliasColumn = "followerAlias";
  readonly posterAliasColumn = "posterAlias";
  readonly timestampColumn = "timestamp";
  readonly postColumn = "post";

  private readonly dynamoDbClient: DynamoDBDocumentClient;

  constructor(dynamoDbClient: DynamoDBDocumentClient) {
    this.dynamoDbClient = dynamoDbClient;
  }

  public async createStory(feed: FeedEntity) {
    console.log("Creating feed: ", feed);

    const params = {
      TableName: this.tableName,

      Item: {
        [this.followerAliasColumn]: feed.followerAlias,
        [this.posterAliasColumn]: feed.posterAlias,
        [this.timestampColumn]: feed.timestamp,
        [this.postColumn]: feed.post,
      },
    };

    console.log("Params: ", params);

    await this.dynamoDbClient.send(new PutCommand(params));
  }

  public async getFeedByAliasPaginated(
    followerAlias: string,
    pageSize: number,
    lastTimestamp?: number
  ): Promise<{ feeds: FeedEntity[]; hasMore: boolean }> {
    console.log("Getting feed by followerAlias:", followerAlias, "with lastTimestamp:", lastTimestamp);

    const lastEvaluatedKey = lastTimestamp
      ? { [this.followerAliasColumn]: followerAlias, [this.timestampColumn]: lastTimestamp }
      : undefined;

    const params = {
      TableName: this.tableName,
      KeyConditionExpression: `${this.followerAliasColumn} = :followerAlias`,
      ExpressionAttributeValues: {
        ":followerAlias": followerAlias,
      },
      Limit: pageSize,
      ExclusiveStartKey: lastEvaluatedKey,
      ScanIndexForward: false,
    };

    console.log("Params:", params);

    const { Items, LastEvaluatedKey } = await this.dynamoDbClient.send(new QueryCommand(params));

    // Map the returned items to FeedEntity objects
    const feeds =
      Items?.map(
        (item) =>
          new FeedEntity(
            item[this.followerAliasColumn],
            item[this.posterAliasColumn],
            item[this.timestampColumn],
            item[this.postColumn]
          )
      ) ?? [];

    // Determine if there are more results
    const hasMore = !!LastEvaluatedKey;

    return { feeds, hasMore };
  }
}
