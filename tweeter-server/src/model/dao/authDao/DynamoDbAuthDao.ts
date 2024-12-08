import { DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { AuthDao } from "./AuthDao";
import { AuthEntity } from "../../entity/AuthEntity";

// Create + Read + Delete
// also automatic expiration / deletion

export class DynamoDBAuthDao implements AuthDao {
  readonly tableName = "auth";

  readonly tokenColumn = "token";
  readonly timestampColumn = "timestamp";
  readonly expiresAtColumn = "expiresAt";

  private readonly dynamoDbClient: DynamoDBDocumentClient;

  constructor(dynamoDbClient: DynamoDBDocumentClient) {
    this.dynamoDbClient = dynamoDbClient;
  }

  public async createAuth(auth: AuthEntity) {
    console.log("Creating auth: ", auth);

    const params = {
      TableName: this.tableName,

      Item: {
        [this.tokenColumn]: auth.token,
        [this.timestampColumn]: auth.timestamp,
        [this.expiresAtColumn]: auth.expiresAt,
      },
    };

    console.log("Params: ", params);

    await this.dynamoDbClient.send(new PutCommand(params));
  }

  public async getAuth(token: string) {
    console.log("Getting auth by token: ", token);

    const params = {
      TableName: this.tableName,
      Key: {
        [this.tokenColumn]: token,
      },
    };

    console.log("Params: ", params);

    const { Item } = await this.dynamoDbClient.send(new GetCommand(params));

    if (Item != null) {
      return new AuthEntity(Item[this.tokenColumn], Item[this.timestampColumn], Item[this.expiresAtColumn]);
    }
    return null;
  }

  public async deleteAuth(token: string) {
    console.log("Deleting auth by token: ", token);

    const params = {
      TableName: this.tableName,
      Key: {
        [this.tokenColumn]: token,
      },
    };

    console.log("Params: ", params);

    await this.dynamoDbClient.send(new DeleteCommand(params));
  }
}
