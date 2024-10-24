import Login from "../../../../src/components/authentication/login/Login";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import React from "react";
import "@testing-library/jest-dom";
import { LoginPresenter } from "../../../../src/presenter/LoginPresenter";

library.add(fab);

describe("Login Component", () => {
  it("should initially render the sign-in button as disabled", () => {
    const { signInButton } = renderLoginAndGetElement("/");
    expect(signInButton).toBeDisabled();
  });

  it("should render the sign-in button as enabled when the alias and password fields are not null", async () => {
    const { signInButton, aliasField, passwordField, user } =
      renderLoginAndGetElement("/");

    await user.type(aliasField, "a");
    await user.type(passwordField, "a");

    expect(signInButton).not.toBeDisabled();
  });

  it("should render the sign-in button as disabled when or alias and password fields are null", async () => {
    const { signInButton, aliasField, passwordField, user } =
      renderLoginAndGetElement("/");

    // Initially not disabled
    await user.type(aliasField, "a");
    await user.type(passwordField, "a");
    expect(signInButton).not.toBeDisabled();

    // Disabled when just alias is empty
    await user.clear(aliasField);
    expect(signInButton).toBeDisabled();

    await user.type(aliasField, "a");
    expect(signInButton).not.toBeDisabled();

    // Disabled when just password is empty
    await user.clear(passwordField);
    expect(signInButton).toBeDisabled();

    // Disabled when both are empty
    await user.clear(aliasField);
    expect(signInButton).toBeDisabled();
  });

  it("should call the presenter's login method with the correct parameters when signing up", async () => {
    const url: string = "/";

    const {
      signInButton,
      aliasField,
      passwordField,
      user,
      rememberMeCheckbox,
    } = renderLoginAndGetElement(url);

    const mockLogin = jest
      .spyOn(LoginPresenter.prototype, "login")
      .mockResolvedValue(Promise.resolve());

    const aliasInput = "a";
    const passwordInput = "b";

    await user.type(aliasField, aliasInput);
    await user.type(passwordField, passwordInput);

    await userEvent.click(rememberMeCheckbox);

    await user.click(signInButton);

    expect(mockLogin).toHaveBeenCalledWith(
      url,
      aliasInput,
      passwordInput,
      true
    );
    mockLogin.mockRestore();
  });
});

const renderLoginAndGetElement = (url: string) => {
  const user = userEvent.setup();

  renderLogin(url);

  const signInButton = screen.getByRole("button", { name: /Sign in/i });
  const aliasField = screen.getByLabelText("Alias");
  const passwordField = screen.getByLabelText("Password");
  const rememberMeCheckbox = screen.getByLabelText("Remember me");

  return { signInButton, aliasField, passwordField, rememberMeCheckbox, user };
};

const renderLogin = (url: string) => {
  return render(
    <MemoryRouter>
      <Login originalUrl={url} />
    </MemoryRouter>
  );
};
