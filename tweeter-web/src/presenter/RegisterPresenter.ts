import { AuthToken, User } from "tweeter-shared";
import { Buffer } from "buffer";
import { AuthPresenter, AuthView } from "./AuthPresenter";

export interface RegisterView extends AuthView {
  setBytesForImage: (bytes: Uint8Array) => void;
  setUrlForImage: (url: string) => void;
  setFileExtensionForImage: (fileExtension: string) => void;
}

export class RegisterPresenter extends AuthPresenter<RegisterView> {
  constructor(view: RegisterView) {
    super(view);
  }

  public getFileExtension(file: File): string | undefined {
    return file.name.split(".").pop();
  }

  public handleImageFile(file: File | undefined) {
    if (file) {
      this.view.setUrlForImage(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const imageStringBase64 = event.target?.result as string;

        const imageStringBase64BufferContents =
          imageStringBase64.split("base64,")[1];

        const bytes: Uint8Array = Buffer.from(
          imageStringBase64BufferContents,
          "base64"
        );

        this.view.setBytesForImage(bytes);
      };
      reader.readAsDataURL(file);

      const fileExtension = this.getFileExtension(file);
      if (fileExtension) {
        this.view.setFileExtensionForImage(fileExtension);
      }
    } else {
      this.view.setUrlForImage("");
      this.view.setBytesForImage(new Uint8Array());
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
    const authOperation = async () => {
      return await this.userService.register(
        firstName,
        lastName,
        alias,
        password,
        imageBytes,
        imageFileExtension
      );
    };

    const url = "/";
    const operationDescription = "register user";

    await this.doAuthFunction(
      authOperation,
      url,
      rememberMe,
      operationDescription
    );
  }
}
