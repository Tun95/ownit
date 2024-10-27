import "./styles.scss";
import { Link } from "react-router-dom";
import logo from "../../assets/logo/logo.png";
import { useAppContext } from "../../utilities/utils/Utils";
import me from "../../assets/others/me.png";
import Sidebar from "../sidebar/Sidebar";

function NavBar() {
  const { state: appState } = useAppContext();
  const { userInfo } = appState;
  return (
    <div className="nav_bar">
      <div className="container">
        <div className="content c_flex">
          <div className="logo">
            <div className="img">
              <img src={logo} alt="logo" />
            </div>
          </div>
          <div className="nav_links">
            <ul className="a_flex">
              <li>
                <Link to="about">About Us</Link>
              </li>
              <li>
                <Link to="/how-it-works">How it works</Link>
              </li>
              <li>
                <Link to="/what-we-do">What we do</Link>
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
                  <Link to="/signin">
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
                  <small>{userInfo && userInfo.email}</small>
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
