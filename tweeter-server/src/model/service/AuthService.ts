import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { DaoFactory } from "../dao/daoFactory/DaoFactory";
import { AuthEntity } from "../entity/Auth";

export class AuthService {
  // To make it faster, use lower salt round count (default is 10)
  private readonly SALT_ROUNDS = 3;
  // 20 Minutes
  private readonly EXPIRATION_TIME = 20 * 60 * 1000;

  private readonly authDao;

  constructor(daoFactory: DaoFactory) {
    this.authDao = daoFactory.createAuthDao();
  }

  public async createAuth(): Promise<string> {
    const token = this.makeToken();
    const timestamp = Date.now();
    const expiresAt = new Date(timestamp + this.EXPIRATION_TIME).toISOString();

    const newAuth = new AuthEntity(token, timestamp, expiresAt);
    await this.authDao.createAuth(newAuth);
    return token;
  }

  public makeToken(): string {
    const random = randomBytes(12);
    return random.toString("base64").substring(0, 16);
  }

  public async EnsureValidAuthTokenThrowsError(token: string) {
    const authToken = await this.authDao.getAuth(token);

    if (!authToken) {
      throw new Error("No such token found. Please log in.");
    }
    const currentTimestamp = Date.now();
    const expiresAt = new Date(authToken.expiresAt).getTime();

    if (currentTimestamp > expiresAt) {
      await this.authDao.deleteAuth(token);
      throw new Error("Your session has expired. Please log back in.");
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
