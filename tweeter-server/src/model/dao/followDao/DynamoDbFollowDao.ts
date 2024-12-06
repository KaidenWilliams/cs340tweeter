import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { FollowDao } from "./FollowDao";

//CRUD
// GetFollowers + GetFollowees

export class DynamoDbFollowDao implements FollowDao {
  private readonly dynamoDbClient: DynamoDBDocumentClient;

  constructor(dynamoDbClient: DynamoDBDocumentClient) {
    this.dynamoDbClient = dynamoDbClient;
  }
}
