import { AuthToken, Status } from "tweeter-shared";

export interface StatusItemView {
  addItems: (newItems: Status[]) => void;
  displayErrorStatement: (message: string) => void;
}

export abstract class StatusItemPresenter {
  private _view: StatusItemView;
  private _lastItem: Status | null = null;
  private _hasMoreItems: boolean = true;

  protected constructor(view: StatusItemView) {
    this._view = view;
  }

  protected get view() {
    return this._view;
  }

  public get lastItem() {
    return this._lastItem;
  }

  public set lastItem(value: Status | null) {
    this._lastItem = value;
  }

  public get hasMoreItems() {
    return this._hasMoreItems;
  }

  public set hasMoreItems(value: boolean) {
    this._hasMoreItems = value;
  }

  public reset() {
    this._lastItem = null;
    this._hasMoreItems = true;
  }

  public abstract loadMoreItems(authToken: AuthToken, userAlias: string): void;
}
