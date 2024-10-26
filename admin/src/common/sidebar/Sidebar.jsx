import "./styles.scss";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import { Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import logo from "../../assets/logo/logo.png";
import { useAppContext } from "../../utilities/utils/Utils";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import ForwardToInboxOutlinedIcon from "@mui/icons-material/ForwardToInboxOutlined";

function Sidebar() {
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
              },
            }}
          >
            <div className="main">
              <span className="toggle_width">
                <span className="logo_span d_flex">
                  <div className="logo_text a_flex">
                    <img src={logo} alt="logo" className="logo" />
                    <h2>#OSYR24</h2>
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
                      <span>Dashboard</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      onClick={toggleDrawer(anchor, false)}
                      to="/users"
                      className="a_flex"
                    >
                      <PeopleAltOutlinedIcon className="icon" />
                      <span>Users</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      onClick={toggleDrawer(anchor, false)}
                      to="/reports"
                      className="a_flex"
                    >
                      <ReceiptOutlinedIcon className="icon" />
                      <span>Reports</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      onClick={toggleDrawer(anchor, false)}
                      to="/message"
                      className="a_flex"
                    >
                      <ForwardToInboxOutlinedIcon className="icon" />
                      <span>Message</span>
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
            </div>
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}

export default Sidebar;
