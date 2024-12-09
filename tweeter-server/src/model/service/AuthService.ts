import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { DaoFactory } from "../dao/daoFactory/DaoFactory";
import { AuthEntity } from "../entity/AuthEntity";
import { config } from "../../config/config";

export class AuthService {
  // To make it faster, use lower salt round count (default is 10)
  private readonly SALT_ROUNDS = 3;

  // 100 Minutes
  private readonly EXPIRATION_TIME_SECONDS = 100 * 60;

  private readonly authDao;

  constructor(daoFactory: DaoFactory) {
    this.authDao = daoFactory.createAuthDao();
  }

  public async createAuth(): Promise<string> {
    const token = this.makeToken();

    // In seconds, not MS
    const timestamp = Math.floor(Date.now() / 1000);
    const expiresAt = timestamp + this.EXPIRATION_TIME_SECONDS;

    const newAuth = new AuthEntity(token, timestamp, expiresAt);
    await this.authDao.createAuth(newAuth);
    return token;
  }

  public makeToken(): string {
    const random = randomBytes(12);
    return random.toString("base64").substring(0, 16).toLowerCase();
  }

  public async EnsureValidAuthTokenThrowsError(token: string) {
    const authEntity = await this.authDao.getAuth(token);

    if (!authEntity) {
      throw new Error(`${config.AUTH_ERROR}: No such token found. Please log in.`);
    }
    const currentTimestamp = Math.floor(Date.now() / 1000);

    if (currentTimestamp > authEntity.expiresAt) {
      await this.authDao.deleteAuth(token);
      throw new Error(`${config.AUTH_ERROR}: Your session has expired. Please log back in.`);
    }
  }

  public async deleteAuth(token: string) {
    await this.authDao.deleteAuth(token);
  }

  public async hashPassword(password: string) {
    const hashed = await bcrypt.hash(password, this.SALT_ROUNDS);
    return hashed;
  }

  public async doPassWordsMatch(enteredPassword: string, hashedPassword: string) {
    const isMatch = await bcrypt.compare(enteredPassword, hashedPassword);
    return isMatch;
  }
}
