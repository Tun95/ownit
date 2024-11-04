import { createContext, useReducer, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode"; // Correct import for jwt-decode
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

export const Context = createContext();

// INITIAL STATE
const initialState = {
  loading: true,
  error: "",
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,
  tokenExpiration: localStorage.getItem("userInfo")
    ? jwtDecode(JSON.parse(localStorage.getItem("userInfo")).token).exp
    : null,
};

// Define the action types
const USER_SIGNIN = "USER_SIGNIN";
const USER_SIGNOUT = "USER_SIGNOUT";

function reducer(state, action) {
  switch (action.type) {
    case USER_SIGNIN: {
      if (typeof action.payload === "object" && action.payload.token) {
        const decodedToken = jwtDecode(action.payload.token);
        localStorage.setItem("userInfo", JSON.stringify(action.payload));
        return {
          ...state,
          userInfo: action.payload,
          tokenExpiration: decodedToken.exp,
        };
      }
      return state;
    }

    case USER_SIGNOUT:
      localStorage.removeItem("userInfo");
      localStorage.removeItem("searchQuery");
      return {
        ...state,
        userInfo: null,
        tokenExpiration: null,
      };

    default:
      return state;
  }
}

export function ContextProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();

  // Check token expiration on initial load
  useEffect(() => {
    const checkTokenExpirationOnLoad = () => {
      if (state.tokenExpiration) {
        const currentTime = Math.floor(Date.now() / 1000); // current time in seconds
        if (currentTime >= state.tokenExpiration) {
          toast.error("Token expired, please login again");
          dispatch({ type: USER_SIGNOUT });
          navigate("/login");
        }
      }
    };
    

    checkTokenExpirationOnLoad();
  }, []);

  // Check token expiration at intervals
  useEffect(() => {
    const checkTokenExpiration = () => {
      if (state.tokenExpiration) {
        const currentTime = Math.floor(Date.now() / 1000);
        if (currentTime >= state.tokenExpiration) {
          toast.error("Token expired, please login again");
          dispatch({ type: USER_SIGNOUT });
          navigate("/login");
        }
      }
    };

    const interval = setInterval(checkTokenExpiration, 1000 * 60); // Check every minute
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [state.tokenExpiration, navigate]);

  // ANTD MENU
  const [open, setOpen] = useState(false);
  const [currentMenu, setCurrentMenu] = useState("register");

  const showDrawer = () => {
    console.log("Drawer is opening");
    setOpen(true);
  };

  const onClose = () => {
    console.log("Drawer is closing");
    setOpen(false);
  };

  const setMenu = (menu) => {
    console.log(`Switching to menu: ${menu}`);
    setCurrentMenu(menu);
  };

  const value = {
    state,
    dispatch,
    open,
    showDrawer,
    onClose,
    currentMenu,
    setMenu,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

ContextProvider.propTypes = {
  children: PropTypes.node,
};
