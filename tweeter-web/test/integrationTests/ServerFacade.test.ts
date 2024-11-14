import "isomorphic-fetch";
import { ServerFacade } from "../../src/model/api/ServerFacade";
import {
  AuthToken,
  GetCountRequest,
  PagedUserItemRequest,
  RegisterRequest,
  User,
  UserDto,
} from "tweeter-shared";

describe("ServerFacade Methods", () => {
  let serverFacade: ServerFacade;

  beforeEach(() => {
    serverFacade = new ServerFacade();
  });

  it("should successfully register a new user", async () => {
    const testFirstName = "big";
    const testLastName = "bob";
    const testAlias = "bobby";

    const registerRequest: RegisterRequest = {
      firstName: testFirstName,
      lastName: testLastName,
      alias: testAlias,
      password: "testpassword",
      userImageBytes: "base64encodedimage",
      imageFileExtension: "jpg",
    };

    const [user, authToken] = await serverFacade.doRegister(registerRequest);

    // Because it just returns a random user I can't test much
    expect(user).toBeInstanceOf(User);

    expect(authToken).toBeInstanceOf(AuthToken);
  });

  it("should retrieve the followers for a user", async () => {
    const pagedUserItemRequest: PagedUserItemRequest = {
      token: "validAuthToken",
      userAlias: "testuser",
      pageSize: 10,
      lastItem: null,
    };

    const [followers, hasMore] = await serverFacade.getMoreFollowers(pagedUserItemRequest);

    expect(Array.isArray(followers)).toBe(true);
    expect(followers.length).toBeGreaterThan(0);

    expect(typeof hasMore).toBe("boolean");
  });

  it("should retrieve the follower count for a user", async () => {
    const userDto: UserDto = {
      firstName: "big",
      lastName: "bob",
      alias: "bobby",
      imageUrl: "https://example.com/image.jpg",
    };

    const getCountRequest: GetCountRequest = {
      token: "validAuthToken",
      user: userDto,
    };

    const count = await serverFacade.getCountFollower(getCountRequest);

    // What else can I even do here?
    expect(typeof count).toBe("number");
  });
});
