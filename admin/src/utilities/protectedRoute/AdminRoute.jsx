import { useContext } from "react";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { Context } from "../../context/Context";

export default function AdminRoute({ children }) {
  const { state } = useContext(Context);
  const { userInfo } = state;

  // Check if the user is logged in and has the role of "admin"
  return userInfo && userInfo.role === "admin" ? (
    children
  ) : (
    <Navigate to="/login" />
  );
}

// PropTypes validation
AdminRoute.propTypes = {
  children: PropTypes.node, // Specify children prop as a node
};
