import { ResponseError } from "../model/api/ResponseError";

export interface BaseView {
  displayErrorStatement: (message: string) => void;
  clearInfoFromUser: () => void;
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

  public async doFailureReportingOperation(operation: () => Promise<void>, operationDescription: string) {
    const anyOperation = async () => {
      try {
        await operation();
      } catch (error) {
        this.view.displayErrorStatement(
          `Failed to ${operationDescription} because of exception: ${(error as Error).message}`
        );
        throw error;
      }
    };

    // Don't want to do anything with errors
    try {
      return await this.doAnyOperation(anyOperation);
    } catch (error) {
      return;
    }
  }

  // This is used to return user to login page if they are not authenticated
  public async doAnyOperation(operation: () => Promise<any>) {
    try {
      return await operation();
    } catch (error) {
      if (error instanceof ResponseError && error.statusCode === 401) {
        this.view.clearInfoFromUser();
        return;
      }
      // Only want to throw errors if it is not 401
      throw error;
    }
  }
}
