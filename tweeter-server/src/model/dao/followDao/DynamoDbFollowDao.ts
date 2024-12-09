import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { FollowDao } from "./FollowDao";
import { FollowEntity } from "../../entity/FollowEntity";

//CRUD
// GetFollowers + GetFollowees

export class DynamoDbFollowDao implements FollowDao {
  readonly tableName = "follow";

  // followerHandle: person who is FOLLOWING
  readonly followerHandleColumn = "followerHandle";
  // followeeHandle: person who is BEING FOLLOWED
  readonly followeeHandleColumn = "followeeHandle";
  readonly secondaryIndexName = "followeeHandle-followerHandle-index";

  private readonly dynamoDbClient: DynamoDBDocumentClient;

  constructor(dynamoDbClient: DynamoDBDocumentClient) {
    this.dynamoDbClient = dynamoDbClient;
  }

  public async createFollow(followerHandle: string, followeeHandle: string) {
    console.log("Creating follow: ", followerHandle, followeeHandle);

    const params = {
      TableName: this.tableName,

      Item: {
        [this.followerHandleColumn]: followerHandle,
        [this.followeeHandleColumn]: followeeHandle,
      },
    };

    console.log("Params: ", params);

    await this.dynamoDbClient.send(new PutCommand(params));
  }

  public async getFollow(followerHandle: string, followeeHandle: string) {
    console.log("Getting follow by followerHandle and followeeHandle: ", followerHandle, followeeHandle);

    const params = {
      TableName: this.tableName,
      Key: {
        [this.followerHandleColumn]: followerHandle,
        [this.followeeHandleColumn]: followeeHandle,
      },
    };

    console.log("Params: ", params);

    const { Item } = await this.dynamoDbClient.send(new GetCommand(params));

    if (Item != null) {
      return new FollowEntity(Item[this.followerHandleColumn], Item[this.followeeHandleColumn]);
    }
    return null;
  }

  // GET ALL THE PEOPLE WHO ARE FOLLOWING YOU - SECONDARY INDEX
  public async getAllFollowersCountForFollowee(followeeHandle: string) {
    const params = {
      TableName: this.tableName,
      IndexName: this.secondaryIndexName,
      KeyConditionExpression: `${this.followeeHandleColumn} = :followeeHandle`,
      ExpressionAttributeValues: {
        ":followeeHandle": followeeHandle,
      },
    };

    const { Items } = await this.dynamoDbClient.send(new QueryCommand(params));

    return Items ? Items.length : 0;
  }

  // GET ALL THE PEOPLE YOU ARE FOLLOWING
  public async getAllFolloweesCountForFollower(followerHandle: string) {
    const params = {
      TableName: this.tableName,
      KeyConditionExpression: `${this.followerHandleColumn} = :followerHandle`,
      ExpressionAttributeValues: {
        ":followerHandle": followerHandle,
      },
    };

    const { Items } = await this.dynamoDbClient.send(new QueryCommand(params));

    return Items ? Items.length : 0;
  }

  public async getAllFollowersForFolloweePaginated(
    followeeHandle: string,
    pageSize: number,
    lastAlias?: string
  ): Promise<{ followers: FollowEntity[]; hasMore: boolean }> {
    console.log("Getting all followers for followee and lastAlias: ", followeeHandle, lastAlias);

    const lastEvaluatedKey = lastAlias
      ? { [this.followeeHandleColumn]: followeeHandle, [this.followerHandleColumn]: lastAlias }
      : undefined;

    const params = {
      TableName: this.tableName,
      IndexName: this.secondaryIndexName,
      KeyConditionExpression: `${this.followeeHandleColumn} = :followeeHandle`,
      ExpressionAttributeValues: {
        ":followeeHandle": followeeHandle,
      },
      Limit: pageSize,
      ExclusiveStartKey: lastEvaluatedKey,
    };

    const { Items, LastEvaluatedKey } = await this.dynamoDbClient.send(new QueryCommand(params));

    const followers =
      Items?.map(
        (item) => new FollowEntity(item[this.followerHandleColumn], item[this.followeeHandleColumn])
      ) ?? [];

    const hasMore = !!LastEvaluatedKey;

    return { followers, hasMore };
  }

  public async getAllFolloweesForFollowerPaginated(
    followerHandle: string,
    pageSize: number,
    lastAlias?: string
  ): Promise<{ followees: FollowEntity[]; hasMore: boolean }> {
    console.log("Getting all followees for follower and lastAlias: ", followerHandle, lastAlias);

    const lastEvaluatedKey = lastAlias
      ? { [this.followerHandleColumn]: followerHandle, [this.followeeHandleColumn]: lastAlias }
      : undefined;

    const params = {
      TableName: this.tableName,
      KeyConditionExpression: `${this.followerHandleColumn} = :followerHandle`,
      ExpressionAttributeValues: {
        ":followerHandle": followerHandle,
      },
      Limit: pageSize,
      ExclusiveStartKey: lastEvaluatedKey,
    };

    const { Items, LastEvaluatedKey } = await this.dynamoDbClient.send(new QueryCommand(params));

    const followees =
      Items?.map(
        (item) => new FollowEntity(item[this.followerHandleColumn], item[this.followeeHandleColumn])
      ) ?? [];

    const hasMore = !!LastEvaluatedKey;

    return { followees, hasMore: hasMore };
  }

  public async deleteFollow(followerHandle: string, followeeHandle: string) {
    console.log("Deleting follow by followerHandle and followeeHandle: ", followerHandle, followeeHandle);

    const params = {
      TableName: this.tableName,
      Key: {
        [this.followerHandleColumn]: followerHandle,
        [this.followeeHandleColumn]: followeeHandle,
      },
    };

    console.log("Params: ", params);

    await this.dynamoDbClient.send(new DeleteCommand(params));
  }
}
