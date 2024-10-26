import { Navigate } from "react-router-dom";
import { useAppContext } from "../utils/Utils";
import PropTypes from "prop-types";

export default function AdminRoute({ children }) {
  const { state: appState } = useAppContext();
  const { userInfo } = appState;

  if (!userInfo) {
    // Handle case where userInfo is null or undefined
    console.error("User info is not available");
    return <Navigate to="/login" />;
  }

  return userInfo.isAdmin ? <>{children}</> : <Navigate to="/" />;
}

AdminRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
