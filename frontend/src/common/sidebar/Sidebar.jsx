import "./styles.scss";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import { Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import logo from "../../assets/logo/logo1.png";
import { useAppContext } from "../../utilities/utils/Utils";
import SettingsApplicationsOutlinedIcon from "@mui/icons-material/SettingsApplicationsOutlined";
import AssuredWorkloadOutlinedIcon from "@mui/icons-material/AssuredWorkloadOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

function Sidebar() {
  const navigate = useNavigate();

  const [state, setState] = useState({
    left: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };

  const { state: cState, dispatch: ctxDispatch } = useAppContext();
  const { userInfo } = cState;

  const signoutHandler = () => {
    ctxDispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    window.location.href = "/";
  };

  // Navigate to Register with Drawer Close
  const navigateToRegister = () => {
    setState({ left: false }); // Close the drawer first
    navigate("/register");
  };

  const navigateToSignin = () => {
    setState({ left: false }); // Close the drawer first
    navigate("/signin");
  };

  return (
    <div>
      {["left"].map((anchor, index) => (
        <React.Fragment key={index}>
          <MenuIcon
            onClick={toggleDrawer(anchor, true)}
            className="menu_icon"
          />
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
            className="side_bar_drawer"
            sx={{ zIndex: 1600 }}
            PaperProps={{
              sx: {
                backgroundColor: "rgba(0, 0, 0, 0.6)",

                "@media (max-width: 320px)": {
                  width: "100%",
                },
              },
            }}
          >
            <div className="main">
              <span className="toggle_width">
                <span className="logo_span d_flex">
                  <div className="logo_text a_flex">
                    <img src={logo} alt="logo" className="logo" />
                  </div>
                  <CloseIcon
                    className="icon"
                    onClick={toggleDrawer(anchor, false)}
                  />
                </span>
              </span>
              <div className="list_info">
                <ul>
                  <li>
                    <Link
                      onClick={toggleDrawer(anchor, false)}
                      to="/"
                      className="a_flex"
                    >
                      <HomeOutlinedIcon className="icon" />
                      <span>Home</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      onClick={toggleDrawer(anchor, false)}
                      to="/about"
                      className="a_flex"
                    >
                      <InfoOutlinedIcon className="icon" />
                      <span>About Us</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      onClick={toggleDrawer(anchor, false)}
                      to="/how-it-works"
                      className="a_flex"
                    >
                      <SettingsApplicationsOutlinedIcon className="icon" />
                      <span>How it works</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      onClick={toggleDrawer(anchor, false)}
                      to="/what-we-do"
                      className="a_flex"
                    >
                      <AssuredWorkloadOutlinedIcon className="icon" />
                      <span>What we do</span>
                    </Link>
                  </li>
                </ul>
                {userInfo && (
                  <span>
                    <Divider className="white" id="white" />
                    <ul className="list user_list">
                      <Divider id="white" />
                      <li>
                        <span
                          onClick={signoutHandler}
                          className="a_flex btn cursor"
                        >
                          <LogoutOutlinedIcon className="icon" />
                          <span>Log out</span>
                        </span>
                      </li>
                    </ul>
                  </span>
                )}
              </div>
              {!userInfo && (
                <div className="login_register f_flex">
                  <div className="register">
                    <button className="main_btn" onClick={navigateToRegister}>
                      Register
                    </button>
                  </div>
                  <div className="login">
                    <button className="main_btn" onClick={navigateToSignin}>
                      Sign In
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}

export default Sidebar;
