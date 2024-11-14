import "isomorphic-fetch";
import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../../src/model/service/StatusService";

describe("StatusService Integration Tests", () => {
  let statusService: StatusService;

  beforeEach(() => {
    statusService = new StatusService();
  });

  it("should successfully retrieve story items", async () => {
    const pageSize = 10;

    // Call the method
    const [storyItems, hasMore] = await statusService.loadMoreStoryItems(
      new AuthToken("testToken", Date.now()),
      "testuser",
      10,
      null
    );

    expect(Array.isArray(storyItems)).toBe(true);
    expect(storyItems.length).toBeLessThanOrEqual(pageSize);

    if (storyItems.length > 0) {
      // I really don't know what else to test here
      const firstItem = storyItems[0];
      expect(firstItem).toBeInstanceOf(Status);
      expect(firstItem.user).toBeInstanceOf(User);
    }

    expect(typeof hasMore).toBe("boolean");
  });
});
