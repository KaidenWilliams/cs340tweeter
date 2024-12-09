import { DynamoDBDocumentClient, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { StoryDao } from "./StoryDao";
import { StoryEntity } from "../../entity/StoryEntity";

// Create + Read

export class DynamoDbStoryDao implements StoryDao {
  readonly tableName = "story";

  readonly aliasColumn = "alias";
  readonly timestampColumn = "timestamp";
  readonly postColumn = "post";

  private readonly dynamoDbClient: DynamoDBDocumentClient;

  constructor(dynamoDbClient: DynamoDBDocumentClient) {
    this.dynamoDbClient = dynamoDbClient;
  }

  public async createStory(story: StoryEntity) {
    console.log("Creating story: ", story);

    const params = {
      TableName: this.tableName,

      Item: {
        [this.aliasColumn]: story.alias,
        [this.timestampColumn]: story.timestamp,
        [this.postColumn]: story.post,
      },
    };

    console.log("Params: ", params);

    await this.dynamoDbClient.send(new PutCommand(params));
  }

  public async getStoriesByAliasPaginated(
    alias: string,
    pageSize: number,
    lastTimestamp?: number
  ): Promise<{ stories: StoryEntity[]; hasMore: boolean }> {
    console.log("Getting stories by alias:", alias, "with lastTimestamp:", lastTimestamp);

    const lastEvaluatedKey = lastTimestamp
      ? { [this.aliasColumn]: alias, [this.timestampColumn]: lastTimestamp }
      : undefined;

    const params = {
      TableName: this.tableName,
      KeyConditionExpression: `${this.aliasColumn} = :alias`,
      ExpressionAttributeValues: {
        ":alias": alias,
      },
      Limit: pageSize,
      ExclusiveStartKey: lastEvaluatedKey,
      ScanIndexForward: false,
    };

    console.log("Params:", params);

    const { Items, LastEvaluatedKey } = await this.dynamoDbClient.send(new QueryCommand(params));

    const stories =
      Items?.map(
        (item) => new StoryEntity(item[this.aliasColumn], item[this.timestampColumn], item[this.postColumn])
      ) ?? [];

    const hasMore = !!LastEvaluatedKey;

    return { stories, hasMore };
  }
}
