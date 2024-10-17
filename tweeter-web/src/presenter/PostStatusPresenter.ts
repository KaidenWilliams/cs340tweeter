import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { BasePresenter, MessageView } from "./BasePresenter";

export interface PostStatusView extends MessageView {
  setLoading: (isLoading: boolean) => void;
  changePost: (post: string) => void;
  clearInfoMessage: () => void;
}

export class PostStatusPresenter extends BasePresenter<PostStatusView> {
  private _statusService: StatusService;

  constructor(view: PostStatusView) {
    super(view);
    this._statusService = new StatusService();
  }

  public async postStatus(
    post: string,
    currentUser: User | null,
    authToken: AuthToken
  ): Promise<void> {
    const operation = async () => {
      this.view.setLoading(true);
      this.view.displayInfoStatement("Posting status...", 0);
      const status = new Status(post, currentUser!, Date.now());
      await this._statusService.postStatus(authToken!, status);

      this.view.changePost("");
      this.view.displayInfoStatement("Status posted!", 2000);
    };

    const operationDescription = "post the status";
    await this.doFailureReportingOperation(operation, operationDescription);

    this.view.clearInfoMessage();
    this.view.setLoading(false);
  }
}
