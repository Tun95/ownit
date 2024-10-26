import { useContext } from "react";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { Context } from "../../context/Context";

export default function ProtectedRoute({ children }) {
  const { state } = useContext(Context);
  const { userInfo } = state;

  // Check if the user is logged in and has the role of "user"
  return (
    <div>
      {userInfo && userInfo.role === "user" ? (
        children
      ) : (
        <Navigate to="/login" />
      )}
    </div>
  );
}

// PropTypes validation
ProtectedRoute.propTypes = {
  children: PropTypes.node, // Specify children prop as a node
};
