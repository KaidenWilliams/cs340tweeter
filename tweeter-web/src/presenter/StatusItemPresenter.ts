import { Status } from "tweeter-shared";
import { PagedItemView, PageItemPresenter } from "./PageItemPresenter";
import { StatusService } from "../model/service/StatusService";

export abstract class StatusItemPresenter extends PageItemPresenter<
  Status,
  StatusService
> {
  public constructor(view: PagedItemView<Status>) {
    super(view, new StatusService());
  }
}
