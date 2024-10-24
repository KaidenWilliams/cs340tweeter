import { instance, mock, verify } from "ts-mockito";
import {
  PostStatusPresenter,
  PostStatusView,
} from "../../src/presenter/PostStatusPresenter";
import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../../src/model/service/StatusService";

describe("PostStatusPresenter", () => {
  let postStatusPresenter: PostStatusPresenter;
  let mockPostStatusView: PostStatusView;

  const post = "Cool new post guys check it out";
  const currentUser = new User("a", "b", "c", "d");
  const authToken = new AuthToken("abc123", Date.now());

  beforeEach(() => {
    // Class to set up what mock should do, verify if mock is called
    mockPostStatusView = mock<PostStatusView>();
    // Actual instance that can be used as the mock
    const mockPostStatusViewInstance = instance(mockPostStatusView);

    postStatusPresenter = new PostStatusPresenter(mockPostStatusViewInstance);
  });

  it("tells the view to display a posting status message", async () => {
    await postStatusPresenter.postStatus(post, currentUser, authToken);
    verify(
      mockPostStatusView.displayInfoStatement("Posting status...", 0)
    ).once();
  });

  it("calls postStatus on the status Service with a correct authToken and status", async () => {
    const mockLogout = jest
      .spyOn(
        StatusService.prototype,
        StatusService.prototype.postStatus.name as keyof StatusService
      )
      .mockResolvedValue(Promise.resolve());

    const mockDate = new Date("2024-01-01T00:00:00Z");
    jest.spyOn(Date, "now").mockImplementation(() => mockDate.getTime());

    await postStatusPresenter.postStatus(post, currentUser, authToken);
    const testStatus = new Status(post, currentUser!, Date.now());

    expect(mockLogout).toHaveBeenCalledWith(authToken, testStatus);
    mockLogout.mockRestore();

    jest.restoreAllMocks();
  });

  it("on succesful posting of status, tells the view to clear the last info message, post, and display a message", async () => {
    const mockLogout = jest
      .spyOn(
        StatusService.prototype,
        StatusService.prototype.postStatus.name as keyof StatusService
      )
      .mockResolvedValue(Promise.resolve());

    await postStatusPresenter.postStatus(post, currentUser, authToken);
    mockLogout.mockRestore();

    verify(mockPostStatusView.changePost("")).once();
    verify(
      mockPostStatusView.displayInfoStatement("Status posted!", 2000)
    ).once();
    verify(mockPostStatusView.clearInfoMessage()).once();
  });

  it("on unsuccesful post status, tells the view to display an error message and clear last info message, does not do other things", async () => {
    const errorMessage = "Bad things happened";

    const mockLogout = jest
      .spyOn(
        StatusService.prototype,
        StatusService.prototype.postStatus.name as keyof StatusService
      )
      .mockRejectedValue(new Error(errorMessage));

    await postStatusPresenter.postStatus(post, currentUser, authToken);
    mockLogout.mockRestore();

    verify(mockPostStatusView.changePost("")).never();
    verify(
      mockPostStatusView.displayInfoStatement("Status posted!", 2000)
    ).never();

    verify(mockPostStatusView.clearInfoMessage()).once();
    verify(
      mockPostStatusView.displayErrorStatement(
        `Failed to post the status because of exception: ${errorMessage}`
      )
    ).once();
  });
});
