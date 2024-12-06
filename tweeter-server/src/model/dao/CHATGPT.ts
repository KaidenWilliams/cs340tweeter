// // CHATGPT

// export interface UserDao {
//   getUser(alias: string): Promise<UserDto | null>;
//   createUser(user: UserDto, passwordHash: string): Promise<void>;
//   validateUser(alias: string, passwordHash: string): Promise<boolean>;
// }

// export interface StatusDao {
//   getFeedItems(
//     userAlias: string,
//     pageSize: number,
//     lastItem: StatusDto | null
//   ): Promise<[StatusDto[], boolean]>;
//   getStoryItems(
//     userAlias: string,
//     pageSize: number,
//     lastItem: StatusDto | null
//   ): Promise<[StatusDto[], boolean]>;
//   postStatus(status: StatusDto): Promise<void>;
// }

// export interface FollowDao {
//   getFollowers(userAlias: string, pageSize: number, lastItem: UserDto | null): Promise<[UserDto[], boolean]>;
//   getFollowees(userAlias: string, pageSize: number, lastItem: UserDto | null): Promise<[UserDto[], boolean]>;
//   followUser(followerAlias: string, followeeAlias: string): Promise<void>;
//   unfollowUser(followerAlias: string, followeeAlias: string): Promise<void>;
// }

// export interface S3Dao {
//   uploadProfileImage(userAlias: string, imageBytes: string, fileExtension: string): Promise<string>;
// }

// import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
// import { DynamoDBDocumentClient, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";

// export const dynamoDbClient = DynamoDBDocumentClient.from(new DynamoDBClient({ region: "us-east-1" }));

// import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
// import { dynamoDbClient } from "./DynamoDbHelper";

// export class DynamoDbUserDao implements UserDao {
//   private tableName = "Users";

//   async getUser(alias: string): Promise<UserDto | null> {
//     const result = await dynamoDbClient.send(
//       new QueryCommand({
//         TableName: this.tableName,
//         KeyConditionExpression: "alias = :alias",
//         ExpressionAttributeValues: { ":alias": alias },
//       })
//     );
//     return result.Items?.[0] ?? null;
//   }

//   async createUser(user: UserDto, passwordHash: string): Promise<void> {
//     await dynamoDbClient.send(
//       new PutCommand({
//         TableName: this.tableName,
//         Item: { ...user, passwordHash },
//       })
//     );
//   }

//   async validateUser(alias: string, passwordHash: string): Promise<boolean> {
//     const user = await this.getUser(alias);
//     return user?.passwordHash === passwordHash;
//   }
// }

// import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
// import { dynamoDbClient } from "./DynamoDbHelper";

// export class DynamoDbStatusDao implements StatusDao {
//   private tableName = "Statuses";

//   async getFeedItems(
//     userAlias: string,
//     pageSize: number,
//     lastItem: StatusDto | null
//   ): Promise<[StatusDto[], boolean]> {
//     const result = await dynamoDbClient.send(
//       new QueryCommand({
//         TableName: this.tableName,
//         KeyConditionExpression: "userAlias = :userAlias",
//         ExpressionAttributeValues: { ":userAlias": userAlias },
//         Limit: pageSize,
//         ExclusiveStartKey: lastItem ?? undefined,
//       })
//     );
//     return [result.Items as StatusDto[], !!result.LastEvaluatedKey];
//   }

//   async getStoryItems(
//     userAlias: string,
//     pageSize: number,
//     lastItem: StatusDto | null
//   ): Promise<[StatusDto[], boolean]> {
//     // Similar to getFeedItems but might filter for "story" statuses
//   }

//   async postStatus(status: StatusDto): Promise<void> {
//     await dynamoDbClient.send(
//       new PutCommand({
//         TableName: this.tableName,
//         Item: status,
//       })
//     );
//   }
// }

// import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// export class S3ImageDao implements S3Dao {
//   private s3Client = new S3Client({ region: "us-east-1" });
//   private bucketName = "user-profile-images";

//   async uploadProfileImage(userAlias: string, imageBytes: string, fileExtension: string): Promise<string> {
//     const key = `${userAlias}/profile.${fileExtension}`;
//     await this.s3Client.send(
//       new PutObjectCommand({
//         Bucket: this.bucketName,
//         Key: key,
//         Body: Buffer.from(imageBytes, "base64"),
//         ContentType: `image/${fileExtension}`,
//       })
//     );
//     return `https://${this.bucketName}.s3.amazonaws.com/${key}`;
//   }
// }

// export class DaoFactory {
//   static createUserDao(): UserDao {
//     return new DynamoDbUserDao();
//   }

//   static createStatusDao(): StatusDao {
//     return new DynamoDbStatusDao();
//   }

//   static createS3Dao(): S3Dao {
//     return new S3ImageDao();
//   }
// }

// import { UserDao } from "./daos/UserDao";
// import { S3Dao } from "./daos/S3Dao";
// import { DaoFactory } from "./daoFactory/DaoFactory";

// export class UserService {
//   private userDao: UserDao = DaoFactory.createUserDao();
//   private s3Dao: S3Dao = DaoFactory.createS3Dao();

//   public async register(
//     firstName: string,
//     lastName: string,
//     alias: string,
//     password: string,
//     userImageBytes: string,
//     imageFileExtension: string
//   ): Promise<[UserDto, string]> {
//     const passwordHash = await bcrypt.hash(password, 10);
//     const profileImageUrl = await this.s3Dao.uploadProfileImage(alias, userImageBytes, imageFileExtension);

//     const user: UserDto = { alias, firstName, lastName, profileImageUrl };
//     await this.userDao.createUser(user, passwordHash);

//     return [user, this.newAuthToken()];
//   }

//   private newAuthToken(): string {
//     return Math.random().toString(36).substring(2, 17);
//   }
// }

// // src/
// // ├── services/
// // │   ├── UserService.ts
// // │   ├── StatusService.ts
// // │   └── FollowService.ts
// // ├── dao/
// // │   ├── interfaces/
// // │   │   ├── IUserDAO.ts
// // │   │   ├── IStatusDAO.ts
// // │   │   ├── IFollowDAO.ts
// // │   │   └── IS3DAO.ts
// // │   ├── dynamoDB/
// // │   │   ├── UserDAODynamoDB.ts
// // │   │   ├── StatusDAODynamoDB.ts
// // │   │   ├── FollowDAODynamoDB.ts
// // │   │   └── S3DAODynamoDB.ts
// // │   └── factories/
// // │       ├── DAOfactory.ts
// // │       └── DynamoDBFactory.ts
// // ├── models/
// // │   ├── UserDto.ts
// // │   ├── StatusDto.ts
// // │   └── FollowDto.ts
// // └── utils/
// //     ├── DynamoDBUtils.ts
// //     └── S3Utils.ts
