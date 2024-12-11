import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  BatchWriteCommand,
  BatchWriteCommandInput,
  BatchWriteCommandOutput,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import * as bcrypt from "bcryptjs";
import { User } from "tweeter-shared";
import { config } from "../config/config";

export class FillUserTableDao {
  //
  // Modify these values as needed to match your user table.
  //
  readonly tableName = "user";

  readonly aliasColumn = "alias";
  readonly passwordHashColumn = "passwordHashed";
  readonly firstNameColumn = "firstName";
  readonly lastNameColumn = "lastName";
  readonly imageUrlColumn = "imageUrl";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient({ region: config.AWS_REGION }));

  async createUsers(userList: User[], password: string) {
    if (userList.length == 0) {
      console.log("zero followers to batch write");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const params = {
      RequestItems: {
        [this.tableName]: this.createPutUserRequestItems(userList, hashedPassword),
      },
    };

    try {
      const resp = await this.client.send(new BatchWriteCommand(params));
      await this.putUnprocessedItems(resp, params);
    } catch (err) {
      throw new Error(`Error while batch writing users with params: ${params}: \n${err}`);
    }
  }

  private createPutUserRequestItems(userList: User[], hashedPassword: string) {
    return userList.map((user) => this.createPutUserRequest(user, hashedPassword));
  }

  private createPutUserRequest(user: User, hashedPassword: string) {
    const item = {
      Item: {
        [this.aliasColumn]: user.alias,
        [this.passwordHashColumn]: hashedPassword,
        [this.firstNameColumn]: user.firstName,
        [this.lastNameColumn]: user.lastName,
        [this.imageUrlColumn]: user.imageUrl,
      },
    };

    return {
      PutRequest: {
        Item: item,
      },
    };
  }

  private async putUnprocessedItems(resp: BatchWriteCommandOutput, params: BatchWriteCommandInput) {
    let delay = 10;
    let attempts = 0;

    while (resp.UnprocessedItems !== undefined && Object.keys(resp.UnprocessedItems).length > 0) {
      attempts++;

      if (attempts > 1) {
        // Pause before the next attempt
        await new Promise((resolve) => setTimeout(resolve, delay));

        // Increase pause time for next attempt
        if (delay < 1000) {
          delay += 100;
        }
      }

      console.log(
        `Attempt ${attempts}. Processing ${Object.keys(resp.UnprocessedItems).length} unprocessed users.`
      );

      params.RequestItems = resp.UnprocessedItems;
      resp = await this.client.send(new BatchWriteCommand(params));
    }
  }
}
