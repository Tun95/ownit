import { useEffect, useReducer, useState } from "react";
import OtpInput from "react-otp-input";
import v1 from "../../../assets/others/v1.png";
import Box from "@mui/material/Box";
import { Formik, ErrorMessage, Form, Field } from "formik";
import { otpSchema } from "../../../schema/Index";
import "../styles.scss";
import { getError, useAppContext } from "../../../utilities/utils/Utils";
import { toast } from "react-toastify";
import axios from "axios";
import { request } from "../../../base url/BaseUrl";
import { useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

// Initial values for the OTP form
const initialOtpValues = {
  otp: "",
};

// Initial state for reducer
const initialState = {
  loading: false,
  error: "",
};

// Reducer function
const reducer = (state, action) => {
  switch (action.type) {
    case "SUBMIT_REQUEST":
      return { ...state, loading: true, error: "" };
    case "SUBMIT_SUCCESS":
      return { ...state, loading: false };
    case "SUBMIT_FAIL":
      return { ...state, loading: false, error: action.payload || "" };
    default:
      return state;
  }
};

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
};

function OtpVerificationComponent() {
  const navigate = useNavigate();
  const { state: appState, dispatch: ctxDispatch } = useAppContext();
  const { userInfo } = appState;

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const mode = sp.get("mode") || "login";
  const final = sp.get("final") || "/";

  const [, dispatch] = useReducer(reducer, initialState);

  // Calculate initial countdown based on the stored end time
  const calculateInitialCountdown = () => {
    const storedEndTime = localStorage.getItem("otpResendEndTime");
    if (storedEndTime) {
      const remainingTime = Math.floor(
        (parseInt(storedEndTime, 10) - Date.now()) / 1000
      );
      return remainingTime > 0 ? remainingTime : 0;
    }
    return 0;
  };

  // State for countdown timer and disabling the button
  const [countdown, setCountdown] = useState(calculateInitialCountdown);
  const [isDisabled, setIsDisabled] = useState(countdown > 0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
        localStorage.setItem(
          "otpResendEndTime",
          (Date.now() + (countdown - 1) * 1000).toString()
        );
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setIsDisabled(false);
      localStorage.removeItem("otpResendEndTime");
    }
  }, [countdown]);

  // Function to handle OTP verification
  const handleVerifiedOTP = (isAccountVerified) => {
    const temporaryUserInfo = JSON.parse(
      localStorage.getItem("temporaryUserInfo") || "{}"
    );
    temporaryUserInfo.isAccountVerified = isAccountVerified;

    if (mode === "login") {
      ctxDispatch({ type: "USER_SIGNIN", payload: temporaryUserInfo });
      localStorage.setItem("userInfo", JSON.stringify(temporaryUserInfo));
    }

    localStorage.removeItem("temporaryUserInfo");
  };

  // Handle form submission
  const handleSubmit = async (values, actions) => {
    try {
      dispatch({ type: "SUBMIT_REQUEST" });

      // Retrieve temporary user info from local storage
      const temporaryUserInfo = JSON.parse(
        localStorage.getItem("temporaryUserInfo") || "{}"
      );

      const { data } = await axios.put(
        `${request}/api/users/verify-otp`,
        { otp: values.otp },
        { headers: { Authorization: `Bearer ${temporaryUserInfo.token}` } }
      );

      dispatch({ type: "SUBMIT_SUCCESS", payload: data });

      setTimeout(() => {
        actions.resetForm();
      }, 2000);

      // Call the function here and pass the isAccountVerified value
      handleVerifiedOTP(data.isAccountVerified);

      // Redirect to the final destination
      if (mode === "register") {
        navigate("/created");
        toast.success("OTP verified, account created successfully", {
          position: "bottom-center",
        });
      } else {
        navigate(final);
        toast.success("OTP verified, login successfully", {
          position: "bottom-center",
        });
      }
    } catch (err) {
      dispatch({
        type: "SUBMIT_FAIL",
        payload: getError(err),
      });
      toast.error(getError(err), {
        position: "bottom-center",
      });
    }
  };

  // Function to handle OTP resend
  const handleResendOtp = async () => {
    try {
      // Retrieve temporary user info from local storage
      const temporaryUserInfo = JSON.parse(
        localStorage.getItem("temporaryUserInfo") || "{}"
      );

      if (temporaryUserInfo && temporaryUserInfo.email) {
        // Your logic to resend OTP
        await axios.post(`${request}/api/users/otp-verification`, {
          email: temporaryUserInfo.email,
          phone: temporaryUserInfo.phone,
        });

        toast.success("Verification email resent successfully", {
          position: "bottom-center",
        });

        setIsDisabled(true);
        const endTime = Date.now() + 60000; // 60 seconds from now
        setCountdown(60); // Start the countdown for 1 minute
        localStorage.setItem("otpResendEndTime", endTime.toString());
      } else {
        // Handle the case where email is not found in local storage
        toast.error("Email not found in local storage", {
          position: "bottom-center",
        });
      }
    } catch (err) {
      toast.error(getError(err), {
        position: "bottom-center",
      });
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <Box className="menu_modal otp_menu">
      <div className="otp_created_pending_login light_shadow header_box">
        <div className="img_width l_flex">
          <div className="img">
            <img src={v1} alt="otp verify" />
          </div>
        </div>
        <div className="form_box">
          <Formik
            initialValues={initialOtpValues}
            validationSchema={otpSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, setFieldValue, errors, values }) => {
              const isOtpComplete = values.otp.length === 6;
              const hasErrors =
                Object.keys(errors).length > 0 || !isOtpComplete;

              return (
                <Form>
                  <div className="inner_form">
                    <div className="form_group a_flex">
                      <Field name="otp">
                        {({ field }) => (
                          <OtpInput
                            value={field.value}
                            onChange={(otp) => setFieldValue("otp", otp)}
                            numInputs={6}
                            inputType="number"
                            renderSeparator={
                              <span className="input_span"></span>
                            }
                            renderInput={(props) => <input {...props} />}
                          />
                        )}
                      </Field>
                      <ErrorMessage
                        name="otp"
                        component="div"
                        className="error"
                      />
                    </div>

                    <div className="form_group">
                      <div className="text_details">
                        <h3>OTP Verification</h3>
                        <small>
                          An OTP code has been sent to your email address.
                          Kindly check and input to verify.
                        </small>
                      </div>
                      <div className="btn l_flex">
                        <button
                          type="submit"
                          className={
                            hasErrors ? "disabled l_flex" : "main_btn l_flex"
                          }
                          disabled={isSubmitting || hasErrors}
                        >
                          {isSubmitting ? (
                            <span className="a_flex">
                              <i className="fa fa-spinner fa-spin"></i>
                              Verifying...
                            </span>
                          ) : (
                            "Verify"
                          )}
                        </button>
                      </div>
                      <div className="text_details l_flex">
                        <small>
                          Didnt receive OTP? &#160;
                          <span
                            onClick={isDisabled ? undefined : handleResendOtp}
                            style={{
                              cursor: isDisabled ? "not-allowed" : "pointer",
                              color: isDisabled ? "grey" : "green",
                            }}
                          >
                            {isDisabled ? "" : "Resend"}
                          </span>
                        </small>
                        {isDisabled && (
                          <div className="timer">
                            {formatTime(countdown)} left
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </Box>
  );
}

OtpVerificationComponent.propTypes = {
  mode: PropTypes.oneOf(["register", "login"]).isRequired,
};

export default OtpVerificationComponent;
