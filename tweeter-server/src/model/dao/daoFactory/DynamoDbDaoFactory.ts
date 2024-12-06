// Implements DAOFactory, creates DynamoDb client to reference

import { S3Client } from "@aws-sdk/client-s3";
import { AuthDao } from "../authDao/AuthDao";
import { DynamoDBAuthDao } from "../authDao/DynamoDbAuthDao";
import { DynamoDbFeedDao } from "../feedDao/DynamoDbFeedDao";
import { FeedDao } from "../feedDao/FeedDao";
import { DynamoDbFollowDao } from "../followDao/DynamoDbFollowDao";
import { FollowDao } from "../followDao/FollowDao";
import { PhotoDao } from "../photoDao/PhotoDao";
import { S3PhotoDao } from "../photoDao/S3PhotoDao";
import { DynamoDbStoryDao } from "../storyDao/DynamoDbStoryDao";
import { StoryDao } from "../storyDao/StoryDao";
import { DynamoDbUserDao } from "../userDao/DynamoDbUserDao";
import { UserDao } from "../userDao/UserDao";
import { DaoFactory } from "./DaoFactory";
import { config } from "../../../config/config";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export class DynamoDbDaoFactory implements DaoFactory {
  private readonly dynamoDbClient: DynamoDBDocumentClient;
  private readonly s3Client: S3Client;

  constructor() {
    this.dynamoDbClient = DynamoDBDocumentClient.from(new DynamoDBClient({ region: config.AWS_REGION }));
    this.s3Client = new S3Client({ region: config.AWS_REGION });
  }

  createFollowDao(): FollowDao {
    return new DynamoDbFollowDao(this.dynamoDbClient);
  }

  createUserDao(): UserDao {
    return new DynamoDbUserDao(this.dynamoDbClient);
  }

  createFeedDao(): FeedDao {
    return new DynamoDbFeedDao(this.dynamoDbClient);
  }

  createStoryDao(): StoryDao {
    return new DynamoDbStoryDao(this.dynamoDbClient);
  }

  createAuthDao(): AuthDao {
    return new DynamoDBAuthDao(this.dynamoDbClient);
  }

  createPhotoDao(): PhotoDao {
    return new S3PhotoDao(this.s3Client);
  }
}
