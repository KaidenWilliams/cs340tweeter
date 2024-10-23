export interface BaseView {
  displayErrorStatement: (message: string) => void;
}

export interface MessageView extends BaseView {
  displayInfoStatement: (message: string, duration: number) => void;
}

export class BasePresenter<T extends BaseView> {
  private _view: T;

  protected constructor(view: T) {
    this._view = view;
  }

  protected get view() {
    return this._view;
  }

  public async doFailureReportingOperation(
    operation: () => Promise<void>,
    operationDescription: string
  ) {
    try {
      await operation();
    } catch (error) {
      this.view.displayErrorStatement(
        `Failed to ${operationDescription} because of exception: ${
          (error as Error).message
        }`
      );
    }
  }
}
