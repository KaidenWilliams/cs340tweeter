export interface BaseView {
  displayErrorStatement: (message: string) => void;
}

export interface MessageView extends BaseView {
  displayInfoStatement: (message: string, duration: number) => void;
}

// TODO make different types of Views, Presenters here

// Just make as much code as possible go bye bye

// Login Presenter + Register Presenter, lot of commonality / common structure
// They want you to use the Template Method

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
        `Failed to ${operationDescription} because of exception: ${error}`
      );
    }
  }
}
