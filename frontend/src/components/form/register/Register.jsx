import { useEffect, useState } from "react";
import { Icon } from "react-icons-kit";
import { eyeOff } from "react-icons-kit/feather/eyeOff";
import { eye } from "react-icons-kit/feather/eye";
import Box from "@mui/material/Box";
import { registerSchema } from "../../../schema/Index";
import { Formik, ErrorMessage, Form, Field } from "formik";
import { useNavigate } from "react-router-dom";
import "../styles.scss";
import axios from "axios";
import { request } from "../../../base url/BaseUrl";
import { toast } from "react-toastify";
import { getError, useAppContext } from "../../../utilities/utils/Utils";
import PropTypes from "prop-types";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

//REGISTER DROPDOWN MENU
const initialRegisterValues = {
  email: "",
  password: "",
  confirmPassword: "",
};

function RegisterComponent() {
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

  //============
  // GOOGLE AUTH
  //============
  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      const { data } = await axios.post(`${request}/api/users/google-auth`, {
        token: credentialResponse.credential,
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate("/");
      toast.success("Welcome back!", {
        position: "bottom-center",
      });
    } catch (err) {
      toast.error(getError(err), {
        position: "bottom-center",
      });
    }
  };

  //==================================
  //REGISTER AND VERIFICATION HANDLER
  //==================================
  const handleSubmit = async (values, actions) => {
    try {
      const { data } = await axios.post(`${request}/api/users/signup`, {
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
        // Pass mode as "register" in query parameters
        navigate(`/otp?mode=register`);
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
      toast.error(getError(err), {
        position: "bottom-center",
      });
    }
  };

  const { state: appState } = useAppContext();
  const { userInfo } = appState;

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  //const clientId = import.meta.env.VITE_REACT_APP_GOOGLE_CLIENT_ID;

  return (
    <GoogleOAuthProvider clientId="408401850346-16eidpftjjqfk57md8ocfv0ieg7800d3.apps.googleusercontent.com">
      <div>
        <Box className="menu_modal login_menu">
          <div className="otp_created_pending_login  header_box">
            <div className="menu_header">
              <div className="left">
                <h2>Sign up to Edquity</h2>
                <span>
                  <p>Welcome back!</p>
                </span>
              </div>
            </div>
            <div className="form_box">
              <Formik
                initialValues={initialRegisterValues}
                validationSchema={registerSchema}
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
                            Email
                            <span className="red">*</span>
                          </label>
                          <Field
                            type="text"
                            id="email"
                            name="email"
                            placeholder="daha@gmail.com"
                            className={`input_box ${
                              touched.email && errors.email
                                ? "error-border"
                                : ""
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
                                Signing up...
                              </span>
                            ) : (
                              "Sign Up"
                            )}
                          </button>
                        </div>
                        {/* GOOGLE BTN HERE */}
                        <div className="google_btn">
                          {" "}
                          <GoogleLogin
                            clientId="408401850346-16eidpftjjqfk57md8ocfv0ieg7800d3.apps.googleusercontent.com"
                            buttonText="Sign up with Google"
                            onSuccess={handleGoogleLoginSuccess}
                            onFailure={() =>
                              console.error("Google Sign-In failed")
                            }
                            cookiePolicy={"single_host_origin"}
                          />
                        </div>

                        <div className="text_details l_flex">
                          <small>
                            Do you have an account? &nbsp;
                            <span
                              onClick={() => navigate("/login")}
                              className="green onClick_span"
                            >
                              Sign in
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
      </div>{" "}
    </GoogleOAuthProvider>
  );
}

// Define prop types
RegisterComponent.propTypes = {
  userInfo: PropTypes.object, // Example prop type, adjust as needed
};

export default RegisterComponent;
