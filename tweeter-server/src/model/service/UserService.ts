import { UserDto } from "tweeter-shared";
import { DaoFactory } from "../dao/daoFactory/DaoFactory";
import { UserEntity } from "../entity/UserEntity";
import { AuthService } from "./AuthService";
import { config } from "../../config/config";

export class UserService {
  private readonly authService;

  private readonly userDao;
  private readonly photoDao;

  constructor(daoFactory: DaoFactory) {
    this.authService = new AuthService(daoFactory);
    this.userDao = daoFactory.createUserDao();
    this.photoDao = daoFactory.createPhotoDao();
  }

  public async getUser(authToken: string, alias: string): Promise<UserDto | null> {
    await this.authService.EnsureValidAuthTokenThrowsError(authToken);

    const user = await this.userDao.getUser(alias);
    if (user == null) return null;

    const userDto: UserDto = {
      firstName: user.firstName,
      lastName: user.lastName,
      alias: user.alias,
      imageUrl: user.imageUrl,
    };

    return userDto;
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: string,
    imageFileExtension: string
  ): Promise<[UserDto, string]> {
    const modifiedAlias = `@${alias}`.toLowerCase();

    // 1. Check if user already exists. If so, throw an error.
    const userThatAlreadyExists = await this.userDao.getUser(modifiedAlias);
    if (userThatAlreadyExists != null) {
      throw new Error(`${config.CLIENT_ERROR}: This user has already registered. Please login instead`);
    }

    // 2. Send photo to S3 DAO
    const fileName = `${modifiedAlias}.${imageFileExtension}`;
    const imageUrl = await this.photoDao.putImage(fileName, userImageBytes);

    // 3. Hash Password
    const hashedPassword = await this.authService.hashPassword(password);

    // 4. Store User in table
    const newUserEntity = new UserEntity(modifiedAlias, hashedPassword, firstName, lastName, imageUrl);
    await this.userDao.createUser(newUserEntity);

    // 5. Make authToken, put in Database
    const authToken = await this.authService.createAuth(modifiedAlias);

    // 6. Return a UserDTO
    const createdUserDto: UserDto = {
      firstName: firstName,
      lastName: lastName,
      alias: modifiedAlias,
      imageUrl: imageUrl,
    };

    return [createdUserDto, authToken];
  }

  public async login(alias: string, password: string): Promise<[UserDto, string]> {
    const user = await this.userDao.getUser(alias);
    if (user === null) {
      throw new Error(`${config.CLIENT_ERROR}: Invalid alias`);
    }

    const validPassword = await this.authService.doPassWordsMatch(password, user.passwordHash);
    if (!validPassword) {
      throw new Error(`${config.CLIENT_ERROR}: Invalid Password`);
    }

    const authToken = await this.authService.createAuth(alias);

    const createdUserDto: UserDto = {
      firstName: user.firstName,
      lastName: user.lastName,
      alias: user.alias,
      imageUrl: user.imageUrl,
    };

    return [createdUserDto, authToken];
  }

  public async logout(authToken: string): Promise<void> {
    await this.authService.EnsureValidAuthTokenThrowsError(authToken);
    await this.authService.deleteAuth(authToken);
  }
}
