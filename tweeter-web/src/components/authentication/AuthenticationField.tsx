interface Props {
  registerOrLoginButton: (event: React.KeyboardEvent<HTMLElement>) => void;
  setAlias: (alias: string) => void;
  setPassword: (password: string) => void;
  mb3OrEmpty: string;
  formControlBottomOrEmpty: string;
}

const AuthenticationField = (props: Props) => {
  return (
    <>
      <div className="form-floating">
        <input
          type="text"
          className="form-control"
          size={50}
          id="aliasInput"
          placeholder="name@example.com"
          onKeyDown={props.registerOrLoginButton}
          onChange={(event) => props.setAlias(event.target.value)}
        />
        <label htmlFor="aliasInput">Alias</label>
      </div>
      <div className={`form-floating ${props.mb3OrEmpty}`}>
        <input
          type="password"
          className={`form-control ${props.formControlBottomOrEmpty}`}
          id="passwordInput"
          placeholder="Password"
          onKeyDown={props.registerOrLoginButton}
          onChange={(event) => props.setPassword(event.target.value)}
        />
        <label htmlFor="passwordInput">Password</label>
      </div>
    </>
  );
};

export default AuthenticationField;
