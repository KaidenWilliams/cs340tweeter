import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import useToastListener from "../../toaster/ToastListenerHook";
import AuthenticationField from "../AuthenticationField";
import useUserInfo from "../../userInfo/UserInfoHook";
import { LoginPresenter, LoginView } from "../../../presenter/LoginPresenter";

interface Props {
  originalUrl?: string;
}

const Login = (props: Props) => {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { updateUserInfo } = useUserInfo();
  const { displayErrorMessage } = useToastListener();

  const view: LoginView = {
    setLoading: setIsLoading,
    navigateToPage: navigate,
    updateUser: updateUserInfo,
    displayErrorStatement: displayErrorMessage,
  };

  const [presenter] = useState(new LoginPresenter(view));

  const isEnterKey = (event: React.KeyboardEvent<HTMLElement>): boolean => {
    return event.key == "Enter";
  };

  const isSubmitButtonValid = () => {
    return !!alias && !!password;
  };

  const loginOnEnter = async (event: React.KeyboardEvent<HTMLElement>) => {
    if (isEnterKey(event) && isSubmitButtonValid()) {
      await presenter.login(props.originalUrl, alias, password, rememberMe);
    }
  };

  const doLogin = async () => {
    await presenter.login(props.originalUrl, alias, password, rememberMe);
  };

  const inputFieldGenerator = () => {
    return (
      <AuthenticationField
        registerOrLoginButton={loginOnEnter}
        setAlias={setAlias}
        setPassword={setPassword}
        mb3OrEmpty="mb-3"
        formControlBottomOrEmpty="bottom"
      />
    );
  };

  const switchAuthenticationMethodGenerator = () => {
    return (
      <div className="mb-3">
        Not registered? <Link to="/register">Register</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Sign In"
      submitButtonLabel="Sign in"
      oAuthHeading="Sign in with:"
      inputFieldGenerator={inputFieldGenerator}
      switchAuthenticationMethodGenerator={switchAuthenticationMethodGenerator}
      setRememberMe={setRememberMe}
      submitButtonDisabled={() => !isSubmitButtonValid()}
      isLoading={isLoading}
      submit={doLogin}
    />
  );
};

export default Login;
