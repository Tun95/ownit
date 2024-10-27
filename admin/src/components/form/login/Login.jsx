import { Icon } from "react-icons-kit";
import { eyeOff } from "react-icons-kit/feather/eyeOff";
import { eye } from "react-icons-kit/feather/eye";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Formik, ErrorMessage, Form, Field } from "formik";
import { loginSchema } from "../../../schema/Index";
import "../styles.scss";
import { toast } from "react-toastify";
import axios from "axios";
import { request } from "../../../base url/BaseUrl";
import { getError, useAppContext } from "../../../utilities/utils/Utils";
import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";

// Initial values for the LOGIN form
const initialLoginValues = {
  email: "",
  password: "",
};

function LoginComponent() {
  const { state: appState } = useAppContext();
  const { userInfo } = appState;

  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";
  const final = sp.get("final") || "/";

  const [passwordType, setPasswordType] = useState("password");
  const [passwordIcon, setPasswordIcon] = useState(eyeOff);

  const handleToggle = () => {
    setPasswordType(passwordType === "password" ? "text" : "password");
    setPasswordIcon(passwordIcon === eyeOff ? eye : eyeOff);
  };

  // LOGIN HANDLE
  const handleSubmit = async (values, actions) => {
    try {
      const { data } = await axios.post(`${request}/api/users/admin/signin`, {
        email: values.email,
        password: values.password,
      });

      localStorage.setItem("temporaryUserInfo", JSON.stringify(data));

      // Send OTP verification email
      const otpResponse = await axios.post(
        `${request}/api/users/otp-verification`,
        {
          email: values.email,
        }
      );

      if (otpResponse.status === 200) {
        // Redirect to OTP verification screen
        setTimeout(() => {
          actions.resetForm();
        }, 1000);

        // Pass mode as "login" in query parameters
        navigate(`/otp?mode=login&redirect=${redirect}&final=${final}`);
        toast.success(
          "An OTP Verification email has been sent to your email.",
          {
            position: "bottom-center",
          }
        );
      } else {
        // Handle error
        toast.error("Failed to send verification email", {
          position: "bottom-center",
        });
      }
    } catch (err) {
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <div>
      <Box className="menu_modal login_menu">
        <div className="otp_created_pending_login light_shadow header_box">
          <div className="menu_header">
            <div className="left">
              <h2>Log In</h2>
            </div>
          </div>
          <div className="form_box">
            <Formik
              initialValues={initialLoginValues}
              validationSchema={loginSchema}
              onSubmit={handleSubmit}
            >
              {({ touched, errors, isSubmitting }) => (
                <Form>
                  <div className="inner_form">
                    <div className="grid_form">
                      <div
                        className={`form_group ${
                          touched.email && errors.email ? "error" : ""
                        }`}
                      >
                        <label htmlFor="email">
                          Email Address
                          <span className="red">*</span>
                        </label>
                        <Field
                          type="text"
                          id="email"
                          name="email"
                          placeholder="Enter your email address"
                          className={`input_box ${
                            touched.email && errors.email ? "error-border" : ""
                          }`}
                        />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="error"
                        />
                      </div>
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
                          placeholder="Enter your password"
                          className={`input_box ${
                            touched.password && errors.password
                              ? "error-border"
                              : ""
                          }`}
                        />
                        <span
                          className="toggle_password"
                          onClick={handleToggle}
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
                              Logging in...
                            </span>
                          ) : (
                            "Log In"
                          )}
                        </button>
                      </div>
                      <div className="text_details l_flex">
                        <small>
                          Dont have an account? &nbsp;
                          <span
                            onClick={() => navigate("/register")}
                            className="green onClick_span"
                          >
                            Register
                          </span>
                        </small>
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

// Adding PropTypes
LoginComponent.propTypes = {
  userInfo: PropTypes.object,
};

export default LoginComponent;
