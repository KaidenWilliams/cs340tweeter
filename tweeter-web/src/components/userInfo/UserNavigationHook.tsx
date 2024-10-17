import {
  DisplayUserPresenter,
  DisplayUserView,
} from "../../presenter/PostPresenter";
import useToastListener from "../toaster/ToastListenerHook";
import useUserInfo from "./UserInfoHook";

const useUserNavigation = () => {
  const { displayErrorMessage } = useToastListener();

  const { setDisplayedUser, currentUser, authToken } = useUserInfo();

  const view: DisplayUserView = {
    setDisplayUser: setDisplayedUser,
    displayErrorStatement: displayErrorMessage,
  };

  // Can't use UseState but I think it is fine
  const presenter = new DisplayUserPresenter(view);

  const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
    event.preventDefault();
    const target = event.target.toString();
    await presenter.displayUser(target, currentUser!, authToken!);
  };

  return { navigateToUser };
};

export default useUserNavigation;
