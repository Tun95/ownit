//import PropTypes from "prop-types";
import "./styles.scss";
import logo from "../../assets/logo/logo.png";
import { Link } from "react-router-dom";
import { useAppContext } from "../../utilities/utils/Utils";
import Sidebar from "../sidebar/Sidebar";
import p1 from "../../assets/nav/p.png";

function MainNavBar() {
  const { state } = useAppContext();
  const { userInfo } = state;

  return (
    <div className="nav_bar main_nav">
      <div className="container">
        <div className="content c_flex">
          <div className="logo_box">
            <Link to="/" className="logo">
              <div className="img">
                <img src={logo} alt="edquity logo" />
              </div>
            </Link>
          </div>

          {userInfo && (
            <span className="a_flex span_gap">
              <div className="user_info a_flex">
                <span className="user_img_icon a_flex">
                  <div className="img">
                    <img src={userInfo.image || p1} alt="user" />
                  </div>
                </span>
              </div>

              <div className="main_sidebar">
                <Sidebar />
              </div>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default MainNavBar;
