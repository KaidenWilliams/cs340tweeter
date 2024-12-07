import { AuthToken } from "tweeter-shared";
import { BasePresenter, BaseView } from "./BasePresenter";

export const PAGE_SIZE = 10;

export interface PagedItemView<T> extends BaseView {
  addItems: (items: T[]) => void;
}

export abstract class PageItemPresenter<T, U> extends BasePresenter<PagedItemView<T>> {
  private _lastItem: T | null = null;
  private _hasMoreItems: boolean = true;
  private _service: U;

  protected constructor(view: PagedItemView<T>, service: U) {
    super(view);
    this._service = service;
  }

  public get lastItem() {
    return this._lastItem;
  }

  public set lastItem(value: T | null) {
    this._lastItem = value;
  }

  public get hasMoreItems() {
    return this._hasMoreItems;
  }

  public set hasMoreItems(value: boolean) {
    this._hasMoreItems = value;
  }

  public get service() {
    return this._service;
  }

  public async loadMoreItems(authToken: AuthToken, userAlias: string) {
    const operation = async () => {
      const [newItems, hasMore] = await this.getMoreItems(authToken, userAlias);

      this.hasMoreItems = hasMore;
      this.lastItem = newItems[newItems.length - 1];
      this.view.addItems(newItems);
    };

    const operationDescription = this.getItemDescription();

    await this.doFailureReportingOperation(operation, operationDescription);
  }

  public reset() {
    this._lastItem = null;
    this._hasMoreItems = true;
  }

  protected abstract getMoreItems(authToken: AuthToken, userAlias: string): Promise<[T[], boolean]>;

  protected abstract getItemDescription(): string;
}
