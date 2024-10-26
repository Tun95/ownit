import "../style/style.css";
import PropTypes from "prop-types";

function MessageBox(props) {
  return (
    <div id="load-err">
      <div className={`alert alert-${props.variant || "info"}`}>
        {props.children}
      </div>
    </div>
  );
}

MessageBox.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.string, // Add prop validation for the 'variant' prop
};

export default MessageBox;
