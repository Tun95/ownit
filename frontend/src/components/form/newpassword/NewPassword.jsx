import { Icon } from "react-icons-kit";
import { eyeOff } from "react-icons-kit/feather/eyeOff";
import { eye } from "react-icons-kit/feather/eye";
import { useReducer, useState } from "react";
import Box from "@mui/material/Box";
import { Formik, ErrorMessage, Form, Field } from "formik";
import { newPasswordSchema } from "../../../schema/Index"; // Use the updated schema
import "../styles.scss";
import { toast } from "react-toastify";
import axios from "axios";
import { request } from "../../../base url/BaseUrl";
import { getError } from "../../../utilities/utils/Utils";
import { useNavigate, useParams } from "react-router-dom";

// Initial values for the New Password form
const initialValues = {
  password: "",
  confirmPassword: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SUBMIT_REQUEST":
      return { ...state, loading: true };
    case "SUBMIT_SUCCESS":
      return { ...state, loading: false };
    case "SUBMIT_FAIL":
      return { ...state, loading: false };
    default:
      return state;
  }
};

function NewPassword() {
  const params = useParams();
  const { token, id: userId } = params;

  const [, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const navigate = useNavigate();
  // Toggle password visibility
  const [passwordType, setPasswordType] = useState("password");
  const [passwordIcon, setPasswordIcon] = useState(eyeOff);
  const [confirmPasswordType, setConfirmPasswordType] = useState("password");
  const [confirmPasswordIcon, setConfirmPasswordIcon] = useState(eyeOff);

  const handleToggle = (field) => {
    if (field === "password") {
      setPasswordType(passwordType === "password" ? "text" : "password");
      setPasswordIcon(passwordIcon === eyeOff ? eye : eyeOff);
    } else if (field === "confirmPassword") {
      setConfirmPasswordType(
        confirmPasswordType === "password" ? "text" : "password"
      );
      setConfirmPasswordIcon(confirmPasswordIcon === eyeOff ? eye : eyeOff);
    }
  };

  const handleSubmit = async (values, actions) => {
    try {
      dispatch({ type: "SUBMIT_REQUEST" });
      const { data } = await axios.put(
        `${request}/api/users/${userId}/reset-password`,
        {
          password: values.password,
          token,
        }
      );
      dispatch({ type: "SUBMIT_SUCCESS", payload: data });
      toast.success(
        "Password reset successfully, you will be redirected to the login screen in 3 seconds",
        {
          position: "bottom-center",
        }
      );
      setTimeout(() => {
        navigate("/login");
      }, 3000);
      setTimeout(() => {
        actions.resetForm();
      }, 1000);
    } catch (err) {
      dispatch({ type: "SUBMIT_FAIL" });
      toast.error(getError(err), { position: "bottom-center" });
    }
  };

  return (
    <div>
      <Box className="menu_modal login_menu">
        <div className="otp_created_pending_login header_box">
          <div className="menu_header">
            <div className="left">
              <h2>New Password</h2>
              <span>
                <p>Enter new password below!</p>
              </span>
            </div>
          </div>
          <div className="form_box">
            <Formik
              initialValues={initialValues}
              validationSchema={newPasswordSchema} // Use newPasswordSchema for validation
              onSubmit={handleSubmit}
            >
              {({ touched, errors, isSubmitting }) => (
                <Form>
                  <div className="inner_form">
                    <div className="grid_form">
                      <div
                        className={`form_group ${
                          touched.password && errors.password ? "error" : ""
                        }`}
                      >
                        <label htmlFor="password">
                          Password<span className="red">*</span>
                        </label>
                        <Field
                          type={passwordType}
                          id="password"
                          name="password"
                          placeholder="Godstimeisthebest@2024"
                          className={`input_box ${
                            touched.password && errors.password
                              ? "error-border"
                              : ""
                          }`}
                        />
                        <span
                          className="toggle_password"
                          onClick={() => handleToggle("password")}
                        >
                          <Icon
                            icon={passwordIcon}
                            size={16}
                            className="eye_icon"
                          />
                        </span>
                        <ErrorMessage
                          name="password"
                          component="div"
                          className="error"
                        />
                      </div>
                      <div
                        className={`form_group ${
                          touched.confirmPassword && errors.confirmPassword
                            ? "error"
                            : ""
                        }`}
                      >
                        <label htmlFor="confirmPassword">
                          Confirm Password<span className="red">*</span>
                        </label>
                        <Field
                          type={confirmPasswordType}
                          id="confirmPassword"
                          name="confirmPassword"
                          placeholder="Godstimeisthebest@2024"
                          className={`input_box ${
                            touched.confirmPassword && errors.confirmPassword
                              ? "error-border"
                              : ""
                          }`}
                        />
                        <span
                          className="toggle_password"
                          onClick={() => handleToggle("confirmPassword")}
                        >
                          <Icon
                            icon={confirmPasswordIcon}
                            size={16}
                            className="eye_icon"
                          />
                        </span>
                        <ErrorMessage
                          name="confirmPassword"
                          component="div"
                          className="error"
                        />
                      </div>
                    </div>
                    <div className="form_group">
                      <div className="btn l_flex">
                        <button
                          type="submit"
                          className="main_btn l_flex"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <span className="a_flex">
                              <i className="fa fa-spinner fa-spin"></i>
                              Resetting Password...
                            </span>
                          ) : (
                            "Reset Password"
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </Box>
    </div>
  );
}

export default NewPassword;
