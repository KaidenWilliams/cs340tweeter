import { anyString, instance, mock, verify } from "ts-mockito";
import {
  AppNavbarPresenter,
  AppNavbarView,
} from "../../src/presenter/AppNavbarPresenter";
import { AuthToken } from "tweeter-shared";
import { UserService } from "../../src/model/service/UserService";

describe("AppNavbarPresenter", () => {
  let appNavbarPresenter: AppNavbarPresenter;
  let mockAppNavbarView: AppNavbarView;

  const authToken = new AuthToken("abc123", Date.now());

  beforeEach(() => {
    // Class to set up what mock should do, verify if mock is called
    mockAppNavbarView = mock<AppNavbarView>();
    // Actual instance that can be used as the mock
    const mockAppNavbarViewInstance = instance(mockAppNavbarView);

    appNavbarPresenter = new AppNavbarPresenter(mockAppNavbarViewInstance);
  });

  it("tells the view to display a logging out message", async () => {
    await appNavbarPresenter.logOut(authToken);
    verify(mockAppNavbarView.displayInfoStatement("Logging Out...", 0)).once();
  });

  it("calls logout on the User Service with a correct authToken", async () => {
    const mockLogout = jest
      .spyOn(
        UserService.prototype,
        UserService.prototype.logout.name as keyof UserService
      )
      .mockResolvedValue(Promise.resolve());

    await appNavbarPresenter.logOut(authToken);

    expect(mockLogout).toHaveBeenCalledWith(authToken);
    mockLogout.mockRestore();
  });

  it("on succesful logout, tells the view to clear the last info message and user info", async () => {
    const mockLogout = jest
      .spyOn(
        UserService.prototype,
        UserService.prototype.logout.name as keyof UserService
      )
      .mockResolvedValue(Promise.resolve());

    await appNavbarPresenter.logOut(authToken);
    mockLogout.mockRestore();

    verify(mockAppNavbarView.clearLastMessage()).once();
    verify(mockAppNavbarView.clearInfoFromUser()).once();
  });

  it("on unsuccesful logout, tells the view to display an error message, does not do other things", async () => {
    const errorMessage = "Bad things happened";

    const mockLogout = jest
      .spyOn(
        UserService.prototype,
        UserService.prototype.logout.name as keyof UserService
      )
      .mockRejectedValue(new Error(errorMessage));

    await appNavbarPresenter.logOut(authToken);
    mockLogout.mockRestore();

    verify(mockAppNavbarView.clearLastMessage()).never();
    verify(mockAppNavbarView.clearInfoFromUser()).never();

    // I think this is bad, this test shouldn't check what the message actually is, that can change so easily and will brick test
    // Good tests like good any other type of code, resistant to change, isolated
    verify(
      mockAppNavbarView.displayErrorStatement(
        `Failed to log out user because of exception: ${errorMessage}`
      )
    ).once();
  });
});
