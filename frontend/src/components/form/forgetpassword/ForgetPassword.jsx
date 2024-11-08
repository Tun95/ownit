import { useReducer } from "react";
import Box from "@mui/material/Box";
import { Formik, ErrorMessage, Form, Field } from "formik";
import { forgetPasswordSchema } from "../../../schema/Index";
import "../styles.scss";
import { toast } from "react-toastify";
import axios from "axios";
import { request } from "../../../base url/BaseUrl";
import { getError } from "../../../utilities/utils/Utils";

// Initial values for the LOGIN form
const initialValues = {
  email: "",
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

function ForgetPassword() {
  const [, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const handleSubmit = async (values, actions) => {
    try {
      dispatch({ type: "SUBMIT_REQUEST" });
      const { data } = await axios.post(`${request}/api/users/password-token`, {
        email: values.email,
      });
      dispatch({ type: "SUBMIT_SUCCESS", payload: data });
      toast.success("Password reset email successfully sent to your email", {
        position: "bottom-center",
      });
    } catch (err) {
      dispatch({ type: "SUBMIT_FAIL" });
      toast.error(getError(err), { position: "bottom-center" });
    }
    setTimeout(() => {
      actions.resetForm();
    }, 1000);
  };

  return (
    <div>
      <Box className="menu_modal login_menu">
        <div className="otp_created_pending_login  header_box">
          <div className="menu_header">
            <div className="left">
              <h2>Forgot Password</h2>
              <span>
                <p>
                  Please enter your email address below, and we&apos;ll send you
                  a link to reset your password.
                </p>
              </span>
            </div>
          </div>
          <div className="form_box">
            <Formik
              initialValues={initialValues}
              validationSchema={forgetPasswordSchema}
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
                          placeholder="example@mail.com"
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
                              Sending...
                            </span>
                          ) : (
                            "Send"
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

export default ForgetPassword;
