// // CLAUDE

// // Abstract interfaces for database-agnostic data access

// import { UserDto, StatusDto } from "tweeter-shared";

// // Generic interface for basic CRUD operations
// export interface BaseDao<T> {
//   create(item: T): Promise<void>;
//   get(key: string): Promise<T | null>;
//   update(item: T): Promise<void>;
//   delete(key: string): Promise<void>;
// }

// // User-specific DAO interface
// export interface UserDao extends BaseDao<UserDto> {
//   getUserByAlias(alias: string): Promise<UserDto | null>;
//   authenticateUser(alias: string, hashedPassword: string): Promise<UserDto | null>;
//   registerUser(
//     firstName: string,
//     lastName: string,
//     alias: string,
//     hashedPassword: string,
//     imageUrl: string
//   ): Promise<UserDto>;
//   getUserFollowerCount(userAlias: string): Promise<number>;
//   getUserFolloweeCount(userAlias: string): Promise<number>;
// }

// // Status-specific DAO interface
// export interface StatusDao extends BaseDao<StatusDto> {
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

// // Follow-specific DAO interface
// export interface FollowDao {
//   follow(authToken: string, followerAlias: string, followeeAlias: string): Promise<void>;
//   unfollow(authToken: string, followerAlias: string, followeeAlias: string): Promise<void>;
//   isFollowing(followerAlias: string, followeeAlias: string): Promise<boolean>;
//   getFollowers(userAlias: string, pageSize: number, lastItem: UserDto | null): Promise<[UserDto[], boolean]>;
//   getFollowees(userAlias: string, pageSize: number, lastItem: UserDto | null): Promise<[UserDto[], boolean]>;
// }

// // S3 DAO interface for file storage
// export interface S3Dao {
//   uploadFile(fileBytes: string, fileExtension: string, isProfileImage: boolean): Promise<string>;
// }

// // Abstract DAO Factory for dependency injection
// export interface DaoFactory {
//   getUserDao(): UserDao;
//   getStatusDao(): StatusDao;
//   getFollowDao(): FollowDao;
//   getS3Dao(): S3Dao;
// }

// import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
// import { DynamoDBDocumentClient, PutCommand, GetCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
// import * as bcrypt from "bcryptjs";
// import { UserDto, StatusDto, UserMapper } from "tweeter-shared";
// import { UserDao, StatusDao, FollowDao, S3Dao, DaoFactory } from "./dao-interfaces";

// // DynamoDB implementation of UserDao
// export class DynamoDBUserDao implements UserDao {
//   private client: DynamoDBDocumentClient;
//   private TABLE_NAME = "Users";

//   constructor() {
//     const dynamoDBClient = new DynamoDBClient({});
//     this.client = DynamoDBDocumentClient.from(dynamoDBClient);
//   }

//   async create(user: UserDto): Promise<void> {
//     const command = new PutCommand({
//       TableName: this.TABLE_NAME,
//       Item: {
//         alias: user.alias,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         imageUrl: user.imageUrl,
//       },
//     });

//     await this.client.send(command);
//   }

//   async getUserByAlias(alias: string): Promise<UserDto | null> {
//     const command = new GetCommand({
//       TableName: this.TABLE_NAME,
//       Key: { alias },
//     });

//     const response = await this.client.send(command);
//     return response.Item ? UserMapper.toDto(response.Item) : null;
//   }

//   async authenticateUser(alias: string, hashedPassword: string): Promise<UserDto | null> {
//     const command = new QueryCommand({
//       TableName: this.TABLE_NAME,
//       KeyConditionExpression: "alias = :alias",
//       FilterExpression: "password = :password",
//       ExpressionAttributeValues: {
//         ":alias": alias,
//         ":password": hashedPassword,
//       },
//     });

//     const response = await this.client.send(command);
//     return response.Items?.length ? UserMapper.toDto(response.Items[0]) : null;
//   }

//   // Implement other methods from UserDao interface...
// }

// // DynamoDB implementation of S3Dao
// export class AWSS3Dao implements S3Dao {
//   async uploadFile(fileBytes: string, fileExtension: string, isProfileImage: boolean): Promise<string> {
//     // Implement S3 file upload logic
//     // This would use AWS SDK to upload to S3 and return the file URL
//     // Implementation details depend on specific S3 configuration
//     return "https://your-bucket.s3.amazonaws.com/path/to/uploaded/file";
//   }
// }

// // DynamoDB DAO Factory for dependency injection
// export class DynamoDBDaoFactory implements DaoFactory {
//   getUserDao(): UserDao {
//     return new DynamoDBUserDao();
//   }

//   getStatusDao(): StatusDao {
//     throw new Error("Not implemented");
//   }

//   getFollowDao(): FollowDao {
//     throw new Error("Not implemented");
//   }

//   getS3Dao(): S3Dao {
//     return new AWSS3Dao();
//   }
// }

// import { DaoFactory } from "./dao-interfaces";
// import { DynamoDBDaoFactory } from "./dynamodb-daos";
// import { UserDto, StatusDto, UserMapper, StatusMapper } from "tweeter-shared";
// import * as bcrypt from "bcryptjs";

// export class UserService {
//   private daoFactory: DaoFactory;

//   constructor(daoFactory: DaoFactory = new DynamoDBDaoFactory()) {
//     this.daoFactory = daoFactory;
//   }

//   public async getUser(authToken: string, alias: string): Promise<UserDto | null> {
//     const userDao = this.daoFactory.getUserDao();
//     return await userDao.getUserByAlias(alias);
//   }

//   public async register(
//     firstName: string,
//     lastName: string,
//     alias: string,
//     password: string,
//     userImageBytes: string,
//     imageFileExtension: string
//   ): Promise<[UserDto, string]> {
//     const userDao = this.daoFactory.getUserDao();
//     const s3Dao = this.daoFactory.getS3Dao();

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Upload profile image
//     const imageUrl = await s3Dao.uploadFile(userImageBytes, imageFileExtension, true);

//     // Create user
//     const newUser = await userDao.registerUser(firstName, lastName, alias, hashedPassword, imageUrl);

//     // Generate auth token (implement secure token generation)
//     const authToken = this.generateAuthToken();

//     return [newUser, authToken];
//   }

//   public async login(alias: string, password: string): Promise<[UserDto, string]> {
//     const userDao = this.daoFactory.getUserDao();

//     // Find user
//     const user = await userDao.getUserByAlias(alias);
//     if (!user) {
//       throw new Error("Invalid alias or password");
//     }

//     // Verify password (assuming user object contains hashed password)
//     const isPasswordValid = await bcrypt.compare(
//       password,
//       user.hashedPassword // New field in UserDto
//     );

//     if (!isPasswordValid) {
//       throw new Error("Invalid alias or password");
//     }

//     // Generate auth token
//     const authToken = this.generateAuthToken();

//     return [user, authToken];
//   }

//   // Secure token generation method
//   private generateAuthToken(): string {
//     // Implement secure token generation
//     // (e.g., using UUID, JWT, or cryptographically secure random generator)
//     return Math.random().toString(36).substring(2, 17);
//   }
// }
