import { useContext } from "react";
import LoadingOverlay from "react-loading-overlay";
import { Context } from "../../../context/Context";
import "../style/style.css";
import PropTypes from "prop-types";

function LoadingOverlayComponent({ children, center }) {
  const { state } = useContext(Context);
  const { loading } = state;

  const overlayStyle = center
    ? { display: "flex", justifyContent: "center", alignItems: "center" }
    : {};

  return (
    <LoadingOverlay
      style={overlayStyle}
      active={loading}
      spinner
      text="Loading..."
    >
      {children}
    </LoadingOverlay>
  );
}

LoadingOverlayComponent.propTypes = {
  children: PropTypes.node,
  center: PropTypes.string, // Add prop validation for the 'variant' prop
};

export default LoadingOverlayComponent;
