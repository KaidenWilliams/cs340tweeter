import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { ChangeEvent } from "react";
import { Buffer } from "buffer";

export interface RegisterView {
  updateInfoUser: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean
  ) => void;
  setLoading: (isLoading: boolean) => void;
  setBytesForImage: (bytes: Uint8Array) => void;
  setUrlForImage: (url: string) => void;
  setFileExtensionForImage: (fileExtension: string) => void;
  displayErrorStatement: (message: string) => void;
  doNavigate: (url: string) => void;
}

export class RegisterPresenter {
  private _view: RegisterView;
  private _userService: UserService;

  constructor(view: RegisterView) {
    this._view = view;
    this._userService = new UserService();
  }

  public getFileExtension(file: File): string | undefined {
    return file.name.split(".").pop();
  }

  public handleImageFile(file: File | undefined) {
    if (file) {
      this._view.setUrlForImage(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const imageStringBase64 = event.target?.result as string;

        const imageStringBase64BufferContents =
          imageStringBase64.split("base64,")[1];

        const bytes: Uint8Array = Buffer.from(
          imageStringBase64BufferContents,
          "base64"
        );

        this._view.setBytesForImage(bytes);
      };
      reader.readAsDataURL(file);

      const fileExtension = this.getFileExtension(file);
      if (fileExtension) {
        this._view.setFileExtensionForImage(fileExtension);
      }
    } else {
      this._view.setUrlForImage("");
      this._view.setBytesForImage(new Uint8Array());
    }
  }

  public async doRegister(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageBytes: Uint8Array,
    imageFileExtension: string,
    rememberMe: boolean
  ) {
    try {
      this._view.setLoading(true);

      const [user, authToken] = await this._userService.register(
        firstName,
        lastName,
        alias,
        password,
        imageBytes,
        imageFileExtension
      );

      this._view.updateInfoUser(user, user, authToken, rememberMe);
      this._view.doNavigate("/");
    } catch (error) {
      this._view.displayErrorStatement(
        `Failed to register user because of exception: ${error}`
      );
    } finally {
      this._view.setLoading(false);
    }
  }
}
