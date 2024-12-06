import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { UserDao } from "./UserDao";

// Create + Paged Read

export class DynamoDbUserDao implements UserDao {
  private readonly dynamoDbClient: DynamoDBDocumentClient;

  constructor(dynamoDbClient: DynamoDBDocumentClient) {
    this.dynamoDbClient = dynamoDbClient;
  }
}
