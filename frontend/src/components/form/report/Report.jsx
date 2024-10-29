import { reportSchema } from "../../../schema/Index";
import "./styles.scss";
import { Formik, ErrorMessage, Form, Field } from "formik";
import { Steps } from "antd";
import { useEffect, useReducer, useState } from "react";
import { getError, useAppContext } from "../../../utilities/utils/Utils";
import { toast } from "react-toastify";
import axios from "axios";
import { request } from "../../../base url/BaseUrl";
import { useNavigate } from "react-router-dom";

const issueTypeOptions = [
  "Infrastructure",
  "Learning Materials",
  "Pupil or Student Related",
  "Teacher Related",
];

const initialReportValues = {
  privacyPreference: "",
  schoolName: "",
  schoolLocation: "",
  issueType: "",
  description: "",
  comment: "",
  images: "",
  video: "",
};

const reportReducer = (state, action) => {
  switch (action.type) {
    case "CREATE_REQUEST":
      return { ...state, loading: true, error: "", success: false };
    case "CREATE_SUCCESS":
      return { ...state, loading: false, success: true };
    case "CREATE_FAIL":
      return { ...state, loading: false, error: action.payload || "" };
    default:
      return state;
  }
};
function ReportComponent() {
  const navigate = useNavigate();

  const { state: appState } = useAppContext();
  const { userInfo } = appState;

  const [currentStep, setCurrentStep] = useState(0);

  const [, dispatch] = useReducer(reportReducer, {
    loading: false,
    error: "",
    success: false,
  });

  useEffect(() => {
    if (userInfo) {
      setCurrentStep(3); // Set step to 3 if userInfo exists
    }
  }, [userInfo]);

  const handleSubmit = async (values, actions) => {
    try {
      dispatch({ type: "CREATE_REQUEST" });

      const formData = new FormData();

      // Iterate through values and append to formData
      for (const key in values) {
        const value = values[key];

        // Only append non-null values
        if (value !== null && value !== undefined) {
          if (typeof value === "boolean") {
            formData.append(key, String(value)); // Convert boolean to string
          } else {
            formData.append(key, value); // Append string or File
          }
        }
      }

      const response = await axios.post(`${request}/api/reports`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      dispatch({ type: "CREATE_SUCCESS", payload: response.data });

      toast.success("Report Submitted Successfully!", {
        position: "bottom-center",
      });

      actions.resetForm();
      setCurrentStep(3);
      navigate("/");
    } catch (err) {
      dispatch({
        type: "CREATE_FAIL",
        payload: await getError(err),
      });
      toast.error(await getError(err), {
        position: "bottom-center",
      });
    } finally {
      actions.setSubmitting(false);
    }
  };

  const handleNext = async (validateForm, touched, setTouched) => {
    // Validate the form
    const errors = await validateForm();

    // Filter errors for the current step
    const stepErrors = Object.keys(errors).filter((key) => {
      if (currentStep === 0) {
        return ["privacyPreference"].includes(key);
      } else if (currentStep === 1) {
        return [
          "schoolName",
          "schoolLocation",
          "issueType",
          "description",
          "comment",
        ].includes(key);
      } else if (currentStep === 2) {
        return ["images", "video"].includes(key);
      }
      return false;
    });

    if (stepErrors.length === 0) {
      // Move to the next step if there are no validation errors
      setCurrentStep((prev) => prev + 1);
    } else {
      // Show all errors for the current step
      const newTouched = { ...touched };
      stepErrors.forEach((key) => {
        newTouched[key] = true;
      });
      setTouched(newTouched, true);
    }
  };

  return (
    <div className="register_component l_flex">
      <div className="content ">
        <div className="steps l_flex">
          <Steps className="steps_box" size="small" current={currentStep}>
            <Steps.Step title="Personal Information" />
            <Steps.Step title="School Information" />
            <Steps.Step title="Uploads" />
          </Steps>
        </div>

        {!userInfo && (
          <Formik
            initialValues={initialReportValues}
            validationSchema={reportSchema}
            onSubmit={handleSubmit}
          >
            {({
              touched,
              //values,
              errors,
              isSubmitting,
              validateForm,
              setFieldValue,
              setTouched,
              // handleChange,
            }) => (
              <Form>
                <div className="inner_form">
                  {/* STEP 1: Personal Information */}
                  <div
                    className={`step ${
                      currentStep >= 0 ? "visible" : "hidden"
                    }`}
                  >
                    <div className="basic_information">
                      <div className="grid_form">
                        <div
                          className={`form_group ${
                            touched.firstName && errors.firstName ? "error" : ""
                          }`}
                        >
                          <span className="input_span">
                            {" "}
                            <label htmlFor="firstName">
                              First Name:
                              <span className="red">*</span>
                            </label>
                            <Field
                              type="text"
                              id="firstName"
                              name="firstName"
                              placeholder="Enter your first name"
                              className={`input_box ${
                                touched.firstName && errors.firstName
                                  ? "error-border"
                                  : ""
                              }`}
                            />
                          </span>
                          <ErrorMessage
                            name="firstName"
                            component="div"
                            className="error"
                          />
                        </div>
                        MY FIRST STEP
                        {/* Step 1 Next Button */}
                        <div
                          className={`form_group ${
                            currentStep === 0 ? "visible" : "hidden"
                          }`}
                        >
                          <div className="btn l_flex">
                            <button
                              type="button"
                              className="main_btn l_flex"
                              onClick={() =>
                                handleNext(validateForm, touched, setTouched)
                              }
                            >
                              <span>Next</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* STEP 2: School Information */}
                  <div
                    className={`step ${
                      currentStep >= 1 ? "visible" : "hidden"
                    }`}
                  >
                    <div className="verification_information">
                      <div className="grid_form">
                        <div
                          className={`form_group ${
                            touched.schoolName && errors.schoolName
                              ? "error"
                              : ""
                          }`}
                        >
                          <span className="input_span">
                            {" "}
                            <label htmlFor="schoolName">
                              School Name:
                              <span className="red">*</span>
                            </label>
                            <Field
                              type="text"
                              id="schoolName"
                              name="schoolName"
                              placeholder="school name"
                              className={`input_box ${
                                touched.schoolName && errors.schoolName
                                  ? "error-border"
                                  : ""
                              }`}
                            />
                          </span>
                          <ErrorMessage
                            name="schoolName"
                            component="div"
                            className="error"
                          />
                        </div>
                        <div
                          className={`form_group ${
                            touched.schoolLocation && errors.schoolLocation
                              ? "error"
                              : ""
                          }`}
                        >
                          <span className="input_span">
                            {" "}
                            <label htmlFor="schoolLocation">
                              School Location:
                              <span className="red">*</span>
                            </label>
                            <Field
                              type="text"
                              id="schoolLocation"
                              name="schoolLocation"
                              placeholder="school location"
                              className={`input_box ${
                                touched.schoolLocation && errors.schoolLocation
                                  ? "error-border"
                                  : ""
                              }`}
                            />
                          </span>
                          <ErrorMessage
                            name="schoolLocation"
                            component="div"
                            className="error"
                          />
                        </div>

                        {/* ISSUE TYPE */}
                        <div
                          className={`form_group ${
                            touched.issueType && errors.issueType ? "error" : ""
                          }`}
                        >
                          <span className="input_span">
                            <label htmlFor="issueType">
                              What type of issue are you reporting?:
                              <span className="red">*</span>
                            </label>
                            <Field
                              as="select"
                              id="issueType"
                              name="issueType"
                              className={`input_box ${
                                touched.issueType && errors.issueType
                                  ? "error-border"
                                  : ""
                              }`}
                              multiple
                              // Handle the change event manually
                              onChange={(event) => {
                                const options = event.target.options;
                                const values = [];
                                for (let i = 0; i < options.length; i++) {
                                  if (options[i].selected) {
                                    values.push(options[i].value);
                                  }
                                }
                                // Update the Formik state
                                setFieldValue("issueType", values);
                              }}
                            >
                              <option value="">Select Issue Type</option>
                              {issueTypeOptions.map((option, index) => (
                                <option key={index} value={option}>
                                  {option}
                                </option>
                              ))}
                            </Field>
                          </span>
                          <ErrorMessage
                            name="issueType"
                            component="div"
                            className="error"
                          />
                        </div>

                        <div
                          className={`form_group ${
                            touched.description && errors.description
                              ? "error"
                              : ""
                          }`}
                        >
                          <span className="input_span">
                            {" "}
                            <label htmlFor="description">
                              Provide the issues in detail:
                              <span className="red">*</span>
                            </label>
                            <Field
                              type="text"
                              id="description"
                              name="description"
                              placeholder="details here"
                              className={`input_box ${
                                touched.description && errors.description
                                  ? "error-border"
                                  : ""
                              }`}
                            />
                          </span>
                          <ErrorMessage
                            name="description"
                            component="div"
                            className="error"
                          />
                        </div>
                        <div
                          className={`form_group ${
                            touched.comment && errors.comment ? "error" : ""
                          }`}
                        >
                          <span className="input_span">
                            {" "}
                            <label htmlFor="comment">
                              Do you have any suggestion or comment about
                              improving the state of the school?:
                              <span className="red">*</span>
                            </label>
                            <Field
                              type="text"
                              id="comment"
                              name="comment"
                              placeholder="details here"
                              className={`input_box ${
                                touched.comment && errors.comment
                                  ? "error-border"
                                  : ""
                              }`}
                            />
                          </span>
                          <ErrorMessage
                            name="comment"
                            component="div"
                            className="error"
                          />
                        </div>
                        {/* Step 2 Next Button */}
                        <div
                          className={`form_group ${
                            currentStep === 1 ? "visible" : "hidden"
                          }`}
                        >
                          <div className="btn l_flex">
                            <button
                              type="button"
                              className="main_btn l_flex"
                              onClick={() =>
                                handleNext(validateForm, touched, setTouched)
                              }
                            >
                              <span>Next</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* STEP 3: Uploads */}
                  <div
                    className={`step ${
                      currentStep >= 2 ? "visible" : "hidden"
                    }`}
                  >
                    <div className="competition _information">
                      <div className="grid_form">
                        {/* Step 3 Finish Button */}
                        <div
                          className={`form_group ${
                            currentStep === 2 ? "visible" : "hidden"
                          }`}
                        >
                          <div className="btn l_flex">
                            <button
                              type="submit"
                              className="main_btn l_flex"
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? (
                                <span className="a_flex">
                                  <i className="fa fa-spinner fa-spin"></i>
                                  Submitting...
                                </span>
                              ) : (
                                <>
                                  <span>Finish</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
}

export default ReportComponent;
