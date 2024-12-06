import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { StoryDao } from "./StoryDao";

// Create + Read

export class DynamoDbStoryDao implements StoryDao {
  private readonly dynamoDbClient: DynamoDBDocumentClient;

  constructor(dynamoDbClient: DynamoDBDocumentClient) {
    this.dynamoDbClient = dynamoDbClient;
  }
}
