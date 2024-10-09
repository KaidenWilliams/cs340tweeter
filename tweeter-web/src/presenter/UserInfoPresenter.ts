import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface UserInfoView {
  setLoading: (isLoading: boolean) => void;
  setFollower: (isFollowing: boolean) => void;
  setCountFollowee: (count: number) => void;
  setCountFollower: (count: number) => void;
  setDisplayUser: (user: User) => void;
  displayInfoStatement: (message: string, duration: number) => void;
  displayErrorStatement: (message: string) => void;
  clearInfoMessage: () => void;
}

export class userInfoPresenter {
  private _view: UserInfoView;
  private _userService: UserService;

  constructor(view: UserInfoView) {
    this._view = view;
    this._userService = new UserService();
  }

  public async setIsFollowerStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ) {
    try {
      if (currentUser === displayedUser) {
        this._view.setFollower(false);
      } else {
        this._view.setFollower(
          await this._userService.getIsFollowerStatus(
            authToken!,
            currentUser!,
            displayedUser!
          )
        );
      }
    } catch (error) {
      this._view.displayErrorStatement(
        `Failed to determine follower status because of exception: ${error}`
      );
    }
  }

  public async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
    try {
      this._view.setCountFollowee(
        await this._userService.getFolloweeCount(authToken, displayedUser)
      );
    } catch (error) {
      this._view.displayErrorStatement(
        `Failed to get followees count because of exception: ${error}`
      );
    }
  }

  public async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
    try {
      this._view.setCountFollower(
        await this._userService.getFollowerCount(authToken, displayedUser)
      );
    } catch (error) {
      this._view.displayErrorStatement(
        `Failed to get followers count because of exception: ${error}`
      );
    }
  }

  public async followDisplayedUser(
    authToken: AuthToken,
    displayedUser: User
  ): Promise<void> {
    try {
      this._view.setLoading(true);
      this._view.displayInfoStatement(`Following ${displayedUser!.name}...`, 0);

      const [followerCount, followeeCount] = await this._userService.follow(
        authToken,
        displayedUser
      );

      this._view.setFollower(true);
      this._view.setCountFollower(followerCount);
      this._view.setCountFollowee(followeeCount);
    } catch (error) {
      this._view.displayErrorStatement(
        `Failed to follow user because of exception: ${error}`
      );
    } finally {
      this._view.clearInfoMessage();
      this._view.setLoading(false);
    }
  }

  public async unfollowDisplayedUser(
    authToken: AuthToken,
    displayedUser: User
  ): Promise<void> {
    try {
      this._view.setLoading(true);
      this._view.displayInfoStatement(
        `Unfollowing ${displayedUser!.name}...`,
        0
      );

      const [followerCount, followeeCount] = await this._userService.unfollow(
        authToken!,
        displayedUser!
      );

      this._view.setFollower(false);
      this._view.setCountFollower(followerCount);
      this._view.setCountFollowee(followeeCount);
    } catch (error) {
      this._view.displayErrorStatement(
        `Failed to unfollow user because of exception: ${error}`
      );
    } finally {
      this._view.clearInfoMessage();
      this._view.setLoading(false);
    }
  }
}
