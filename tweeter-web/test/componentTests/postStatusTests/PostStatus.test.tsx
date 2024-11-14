import PostStatus from "../../../src/components/postStatus/PostStatus";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import React from "react";
import "@testing-library/jest-dom";
import useUserInfo from "../../../src/components/userInfo/UserInfoHook";
import { User } from "tweeter-shared";
import { PostStatusPresenter } from "../../../src/presenter/PostStatusPresenter";

library.add(fab);

jest.mock("../../../src/components/userInfo/UserInfoHook", () => ({
  ...jest.requireActual("../../../src/components/userInfo/UserInfoHook"),
  __esModule: true,
  default: jest.fn(),
}));

const mockUserInstance = new User("a", "b", "c", "d"); // Adjust this as per your user structure
const mockAuthTokenInstance = "mockAuthToken123";

beforeAll(() => {
  (useUserInfo as jest.Mock).mockReturnValue({
    currentUser: mockUserInstance,
    authToken: mockAuthTokenInstance,
  });
});

describe("Login Component", () => {
  it("should initially render the post status and clear buttons as disabled", () => {
    const { postStatusButton, clearButton } = renderPostStatusAndGetElements();

    expect(postStatusButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("should render the post status and clear button as enabled when the text field has text", async () => {
    const { postStatusButton, clearButton, statusTextField, user } = renderPostStatusAndGetElements();

    await user.type(statusTextField, "a");
    expect(statusTextField).toHaveValue("a");

    expect(postStatusButton).not.toBeDisabled();
    expect(clearButton).not.toBeDisabled();
  });

  it("should render the post status and clear button as disabled when the text field is cleared", async () => {
    const { postStatusButton, clearButton, statusTextField, user } = renderPostStatusAndGetElements();

    await user.type(statusTextField, "a");
    expect(statusTextField).toHaveValue("a");

    // Should not be disabled when text field has a value
    expect(postStatusButton).not.toBeDisabled();
    expect(clearButton).not.toBeDisabled();

    // Should be disabled when the text field does not have a value
    await user.clear(statusTextField);

    expect(postStatusButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("should call the presenter's postStatus method with correct parameters", async () => {
    const { postStatusButton, statusTextField, user } = renderPostStatusAndGetElements();

    const mockPostStatus = jest
      .spyOn(PostStatusPresenter.prototype, "postStatus")
      .mockResolvedValue(Promise.resolve());

    const post = "a";
    await user.type(statusTextField, post);

    expect(postStatusButton).not.toBeDisabled();
    await user.click(postStatusButton);

    expect(mockPostStatus).toHaveBeenCalledWith(post, mockUserInstance, mockAuthTokenInstance);

    mockPostStatus.mockRestore();
  });
});

const renderPostStatusAndGetElements = () => {
  const user = userEvent.setup();

  renderStatus();

  const clearButton = screen.getByRole("button", { name: /Clear/i });
  const postStatusButton = screen.getByRole("button", { name: /Post Status/i });
  const statusTextField = screen.getByPlaceholderText("What's on your mind?");

  return { postStatusButton, clearButton, statusTextField, user };
};

const renderStatus = () => {
  return render(<PostStatus />);
};
