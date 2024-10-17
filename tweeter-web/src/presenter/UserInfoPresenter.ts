import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { BasePresenter, MessageView } from "./BasePresenter";

export interface UserInfoView extends MessageView {
  setLoading: (isLoading: boolean) => void;
  setFollower: (isFollowing: boolean) => void;
  setCountFollowee: (count: number) => void;
  setCountFollower: (count: number) => void;
  setDisplayUser: (user: User) => void;
  clearInfoMessage: () => void;
}

export class userInfoPresenter extends BasePresenter<UserInfoView> {
  private _followService: FollowService;

  constructor(view: UserInfoView) {
    super(view);
    this._followService = new FollowService();
  }

  public async setIsFollowerStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ) {
    const operation = async () => {
      if (currentUser === displayedUser) {
        this.view.setFollower(false);
      } else {
        this.view.setFollower(
          await this._followService.getIsFollowerStatus(
            authToken!,
            currentUser!,
            displayedUser!
          )
        );
      }
    };

    const operationDescription = "determine follower status";
    await this.doFailureReportingOperation(operation, operationDescription);
  }

  public async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
    const operation = async () => {
      this.view.setCountFollowee(
        await this._followService.getFolloweeCount(authToken, displayedUser)
      );
    };

    const operationDescription = "get followees count";
    await this.doFailureReportingOperation(operation, operationDescription);
  }

  public async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
    const operation = async () => {
      this.view.setCountFollower(
        await this._followService.getFollowerCount(authToken, displayedUser)
      );
    };

    const operationDescription = "get followers count";
    await this.doFailureReportingOperation(operation, operationDescription);
  }

  public async followDisplayedUser(
    authToken: AuthToken,
    displayedUser: User
  ): Promise<void> {
    const followOperation = async () => {
      return await this._followService.follow(authToken, displayedUser);
    };

    const isCurrentlyFollowing = false;
    await this.changeFollowStatus(
      followOperation,
      displayedUser,
      isCurrentlyFollowing
    );
  }

  public async unfollowDisplayedUser(
    authToken: AuthToken,
    displayedUser: User
  ): Promise<void> {
    const followOperation = async () => {
      return await this._followService.unfollow(authToken!, displayedUser!);
    };

    const isCurrentlyFollowing = true;
    await this.changeFollowStatus(
      followOperation,
      displayedUser,
      isCurrentlyFollowing
    );
  }

  private async changeFollowStatus(
    followOperation: () => Promise<[number, number]>,
    displayedUser: User,
    isCurrentlyFollowing: boolean
  ): Promise<void> {
    const displayText = isCurrentlyFollowing ? "Unfollowing" : "Following";
    const errorText = isCurrentlyFollowing ? "unfollow" : "follow";

    const operation = async () => {
      this.view.setLoading(true);
      this.view.displayInfoStatement(
        `${displayText} ${displayedUser!.name}...`,
        0
      );

      const [followerCount, followeeCount] = await followOperation();

      this.view.setFollower(!isCurrentlyFollowing);
      this.view.setCountFollower(followerCount);
      this.view.setCountFollowee(followeeCount);
    };

    const operationDescription = `${errorText} user`;
    await this.doFailureReportingOperation(operation, operationDescription);

    this.view.clearInfoMessage();
    this.view.setLoading(false);
  }
}
