import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { AuthDao } from "./AuthDao";

// Create + Read + Delete
// also automatic expiration / deletion

export class DynamoDBAuthDao implements AuthDao {
  private readonly dynamoDbClient: DynamoDBDocumentClient;

  constructor(dynamoDbClient: DynamoDBDocumentClient) {
    this.dynamoDbClient = dynamoDbClient;
  }

  //   readonly tableName = "follows";
  //   readonly followerHandleAttr = "follower_handle";
  //   readonly followerNameAttr = "follower_name";
  //   readonly followeeHandleAttr = "followee_handle";
  //   readonly followeeNameAttr = "followee_name";

  // async putFollow(follow: Follow) {
  //     const params = {
  //       TableName: this.tableName,
  //       Item: {
  //         [this.followerHandleAttr]: follow.follower_handle,
  //         [this.followerNameAttr]: follow.follower_name,
  //         [this.followeeHandleAttr]: follow.followee_handle,
  //         [this.followeeNameAttr]: follow.followee_name,
  //       },
  //     };

  //     await this.client.send(new PutCommand(params));
  //   }

  //   async getFollow(follower_handle: string, followee_handle: string): Promise<Follow | null> {
  //     const params = {
  //       TableName: this.tableName,
  //       Key: {
  //         [this.followerHandleAttr]: follower_handle,
  //         [this.followeeHandleAttr]: followee_handle,
  //       },
  //     };

  //     const { Item } = await this.client.send(new GetCommand(params));
  //     if (Item) {
  //       return new Follow(
  //         Item[this.followerHandleAttr],
  //         Item[this.followerNameAttr],
  //         Item[this.followeeHandleAttr],
  //         Item[this.followeeNameAttr]
  //       );
  //     }
  //     return null;
  //   }

  //   async updateFollow(
  //     follower_handle: string,
  //     followee_handle: string,
  //     // Allows you to only pass in certain fields from an object
  //     // Kind nifty, TS is cool
  //     updatedFields: Partial<Follow>
  //   ) {
  //     const params = {
  //       TableName: this.tableName,
  //       Key: {
  //         [this.followerHandleAttr]: follower_handle,
  //         [this.followeeHandleAttr]: followee_handle,
  //       },
  //       UpdateExpression: "set follower_name = :follower_name, followee_name = :followee_name",
  //       ExpressionAttributeValues: {
  //         ":follower_name": updatedFields.follower_name,
  //         ":followee_name": updatedFields.followee_name,
  //       },
  //     };

  //     await this.client.send(new UpdateCommand(params));
  //   }

  //   async deleteFollow(follower_handle: string, followee_handle: string): Promise<void> {
  //     const params = {
  //       TableName: this.tableName,
  //       Key: {
  //         [this.followerHandleAttr]: follower_handle,
  //         [this.followeeHandleAttr]: followee_handle,
  //       },
  //     };

  //     await this.client.send(new DeleteCommand(params));
  //   }
}
