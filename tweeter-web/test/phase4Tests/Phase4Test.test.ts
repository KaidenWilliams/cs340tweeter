import "isomorphic-fetch";
import { LoginRequest, PagedStatusItemRequest } from "tweeter-shared";
import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { ServerFacade } from "../../src/model/api/ServerFacade";
import { PostStatusPresenter, PostStatusView } from "../../src/presenter/PostStatusPresenter";

// Mock view to track interactions
class MockPostStatusView implements PostStatusView {
  setLoading = jest.fn();
  changePost = jest.fn();
  displayInfoStatement = jest.fn();
  displayErrorStatement = jest.fn();
  clearInfoMessage = jest.fn();
  clearInfoFromUser = jest.fn();
}

describe("PostStatusPresenter Integration Test", () => {
  let serverFacade: ServerFacade;
  let mockView: MockPostStatusView;
  let presenter: PostStatusPresenter;

  beforeEach(() => {
    serverFacade = new ServerFacade();
    mockView = new MockPostStatusView();
    presenter = new PostStatusPresenter(mockView);
  });

  // 1. Login a user. [This can be done by directly accessing the ServerFacade or client side service class]
  // 2. Post a status from the user to the server by calling the "post status" operation on the relevant Presenter.
  // 3. Verify that the "Successfully Posted!" message was displayed to the user.
  // 4. Retrieve the user's story from the server to verify that the new status was correctly appended to the user's story, and that all status details are correct. [This can be done by directly accessing the ServerFacade or client side service class]"

  it("should successfully post a status and verify it appears in user story", async () => {
    // 1. Test Login Server Facade
    const loginRequest: LoginRequest = {
      alias: "test1",
      password: "test1",
    };

    const [user, authToken] = await serverFacade.doLogin(loginRequest);
    expect(user.alias).toEqual(`@${loginRequest.alias}`);

    // 2. Call Presenter
    const timeAtPost = Date.now();

    const testPost = "test post";
    await presenter.postStatus(testPost, user, authToken);

    // 3. Verify that succesfully posted message was displayed (can I just see if function was called?)
    expect(mockView.displayInfoStatement).toHaveBeenCalledWith("Posting status...", 0);
    expect(mockView.displayInfoStatement).toHaveBeenCalledWith("Status posted!", 2000);

    //4. Retrieve user's story from server
    const storyRequest: PagedStatusItemRequest = {
      token: authToken.token,
      userAlias: user.alias,
      pageSize: 1000,
      lastItem: null,
    };

    const [statuses, hasMore] = await serverFacade.getStoryItems(storyRequest);

    // - find the post in the list of statuses
    let isExpectedPostInList: boolean = false;

    for (const status of statuses) {
      const text = status.post;
      const date = status.timestamp;

      // If the post has the correct text and was made at the correct time, then it is the expected post
      if (text === testPost && date <= timeAtPost) {
        isExpectedPostInList = true;
        break;
      }
    }

    expect(isExpectedPostInList).toBe(true);
  });
});
