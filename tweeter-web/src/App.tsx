import "./App.css";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Login from "./components/authentication/login/Login";
import Register from "./components/authentication/register/Register";
import MainLayout from "./components/mainLayout/MainLayout";
import Toaster from "./components/toaster/Toaster";
import useUserInfo from "./components/userInfo/UserInfoHook";
import { FolloweePresenter } from "./presenter/FolloweePresenter";
import { FollowerPresenter } from "./presenter/FollowerPresenter";
import { FeedPresenter } from "./presenter/FeedPresenter";
import { StoryPresenter } from "./presenter/StoryPresenter";
import ItemScroller from "./components/mainLayout/ItemScroller";
import { Status, User } from "tweeter-shared";
import { FollowService } from "./model/service/FollowService";
import UserItem from "./components/userItem/UserItem";
import { PagedItemView } from "./presenter/PageItemPresenter";
import StatusItem from "./components/statusItem/StatusItem";
import { StatusService } from "./model/service/StatusService";

const App = () => {
  const { currentUser, authToken } = useUserInfo();

  const isAuthenticated = (): boolean => {
    return !!currentUser && !!authToken;
  };

  return (
    <div>
      <Toaster position="top-right" />
      <BrowserRouter>
        {isAuthenticated() ? (
          <AuthenticatedRoutes />
        ) : (
          <UnauthenticatedRoutes />
        )}
      </BrowserRouter>
    </div>
  );
};

const AuthenticatedRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to="/feed" />} />

        <Route
          path="feed"
          element={
            <ItemScroller<Status, StatusService>
              key={1}
              constructPresenter={(view: PagedItemView<Status>) =>
                new FeedPresenter(view)
              }
              constructItemComponent={(item: Status) => (
                <StatusItem value={item} />
              )}
            />
          }
        />
        <Route
          path="story"
          element={
            <ItemScroller<Status, StatusService>
              key={2}
              constructPresenter={(view: PagedItemView<Status>) =>
                new StoryPresenter(view)
              }
              constructItemComponent={(item: Status) => (
                <StatusItem value={item} />
              )}
            />
          }
        />
        <Route
          path="followees"
          element={
            <ItemScroller<User, FollowService>
              key={3}
              constructPresenter={(view: PagedItemView<User>) =>
                new FolloweePresenter(view)
              }
              constructItemComponent={(item: User) => <UserItem value={item} />}
            />
          }
        />
        <Route
          path="followers"
          element={
            <ItemScroller<User, FollowService>
              key={4}
              constructPresenter={(view: PagedItemView<User>) =>
                new FollowerPresenter(view)
              }
              constructItemComponent={(item: User) => <UserItem value={item} />}
            />
          }
        />
        <Route path="logout" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/feed" />} />
      </Route>
    </Routes>
  );
};

const UnauthenticatedRoutes = () => {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Login originalUrl={location.pathname} />} />
    </Routes>
  );
};

export default App;
