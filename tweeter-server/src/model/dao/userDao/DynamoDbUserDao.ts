import { DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { UserDao } from "./UserDao";
import { UserEntity } from "../../entity/User";

// Create + Paged Read?
export class DynamoDbUserDao implements UserDao {
  readonly tableName = "user";

  readonly aliasColumn = "token";
  readonly passwordHashColumn = "passwordHasd";
  readonly firstNameColumn = "firstName";
  readonly lastNameColumn = "lastName";
  readonly imageUrlColumn = "imageUrl";

  private readonly dynamoDbClient: DynamoDBDocumentClient;

  constructor(dynamoDbClient: DynamoDBDocumentClient) {
    this.dynamoDbClient = dynamoDbClient;
  }

  public async createUser(user: UserEntity) {
    const params = {
      TableName: this.tableName,
      Item: {
        [this.aliasColumn]: user.alias,
        [this.passwordHashColumn]: user.passwordHash,
        [this.firstNameColumn]: user.firstName,
        [this.lastNameColumn]: user.lastName,
        [this.imageUrlColumn]: user.imageUrl,
      },
    };

    await this.dynamoDbClient.send(new PutCommand(params));
  }

  public async getUser(alias: string) {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.aliasColumn]: alias,
      },
    };

    const { Item } = await this.dynamoDbClient.send(new GetCommand(params));

    if (Item != null) {
      return new UserEntity(
        Item[this.aliasColumn],
        Item[this.passwordHashColumn],
        Item[this.firstNameColumn],
        Item[this.lastNameColumn],
        Item[this.imageUrlColumn]
      );
    }
    return null;
  }
}
