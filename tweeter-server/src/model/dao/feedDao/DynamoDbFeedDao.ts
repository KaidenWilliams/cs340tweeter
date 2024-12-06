import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { FeedDao } from "./FeedDao";

// Create + Paged Read

export class DynamoDbFeedDao implements FeedDao {
  private readonly dynamoDbClient: DynamoDBDocumentClient;

  constructor(dynamoDbClient: DynamoDBDocumentClient) {
    this.dynamoDbClient = dynamoDbClient;
  }
}
