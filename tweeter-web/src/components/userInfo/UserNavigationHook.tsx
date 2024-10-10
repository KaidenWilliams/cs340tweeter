import useToastListener from "../toaster/ToastListenerHook";
import useUserInfo from "./UserInfoHook";
import {
  UserNavigationHookPresenter,
  UserNavigationHookView,
} from "../../presenter/UserNavigationHookPresenter";

const useUserNavigation = () => {
  const { displayErrorMessage } = useToastListener();

  const { setDisplayedUser, currentUser, authToken } = useUserInfo();

  const view: UserNavigationHookView = {
    setDisplayUser: setDisplayedUser,
    displayErrorStatement: displayErrorMessage,
  };

  // Can't use UseState but I think it is fine
  const presenter = new UserNavigationHookPresenter(view);

  const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
    event.preventDefault();
    const target = event.target.toString();
    await presenter.navigateToUser(currentUser!, target, authToken!);
  };

  return { navigateToUser };
};

export default useUserNavigation;
