import "./styles.scss";
import { Link } from "react-router-dom";
import logo from "../../assets/logo/logo1.png";
import { useAppContext } from "../../utilities/utils/Utils";
import me from "../../assets/others/me.png";
import Sidebar from "../sidebar/Sidebar";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

function NavBar() {
  const { state: appState, dispatch: ctxDispatch } = useAppContext();
  const { userInfo } = appState;

  const signoutHandler = () => {
    ctxDispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    window.location.href = "/";
  };
  return (
    <div className="nav_bar">
      <div className="container">
        <div className="content c_flex">
          <div className="logo">
            <div className="img">
              <Link to="/">
                <img src={logo} alt="logo" />
              </Link>
            </div>
          </div>

          <div className="nav_links">
            <ul className="a_flex">
              <li>
                <a href="#about">About Us</a>
              </li>
              <li>
                <a href="#how-it-works">How it works</a>
              </li>
              <li>
                <a href="#what-we-do">What we do</a>
              </li>
            </ul>
          </div>

          <div className="register_login a_flex">
            {!userInfo ? (
              <>
                <div className="img">
                  <img src={me} alt="user" />
                </div>
                <div className="link a_flex">
                  <Link to="/login">
                    <small>Sign in</small>
                  </Link>
                  <span className="slash">/</span>
                  <Link to="/register">
                    <small>Register</small>
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className="img">
                  <img src={me} alt="user" />
                </div>
                <div className="link a_flex">
                  {userInfo && (
                    <small>
                      {userInfo.lastName} {userInfo.firstName}
                    </small>
                  )}
                </div>
                <div className="logout" onClick={signoutHandler}>
                  <LogoutOutlinedIcon className="icon" />
                </div>
              </>
            )}
          </div>
          <div className="main_sidebar">
            <Sidebar />
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavBar;
