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
import s1 from "../../../assets/report/s1.png";
import s2 from "../../../assets/report/s2.png";
import { Autocomplete, TextField } from "@mui/material";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";

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

  // Handle clicking on previous steps to navigate back
  const handleStepClick = (step) => {
    if (step < currentStep) {
      setCurrentStep(step);
    }
  };

  //============
  //TOGGLE BOX
  //============
  const [openBox, setOpenBox] = useState("public");

  const toggleBox = (method) => {
    if (openBox === method) {
      // Clicking on the currently open box; do nothing
      return;
    }
    setOpenBox(method);
  };
  return (
    <div className="register_component l_flex">
      <div className="content ">
        <div className="steps l_flex">
          <Steps className="steps_box" size="small" current={currentStep}>
            <Steps.Step
              title="Personal Information"
              onClick={() => handleStepClick(0)}
            />
            <Steps.Step
              title="School Information"
              onClick={() => handleStepClick(1)}
            />
            <Steps.Step title="Uploads" onClick={() => handleStepClick(2)} />
          </Steps>
        </div>
        <Formik
          initialValues={initialReportValues}
          validationSchema={reportSchema}
          onSubmit={handleSubmit}
        >
          {({
            touched,
            values,
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
                {currentStep === 0 && (
                  <div className="basic_information">
                    <div className="grid_form">
                      <div className="step_description_text">
                        <div className="top_text">
                          <small>
                            <p>Pick and option you prefer</p>
                          </small>
                        </div>
                        <div className="lower_text">
                          <p>
                            Would you like to include your name or you prefer to
                            report anonymous
                          </p>
                        </div>
                      </div>
                      {/* LABELS */}
                      <div className="labels l_flex">
                        <div className="labels_box f_flex">
                          <label
                            className={
                              openBox === "anonymous"
                                ? "active privacy_label"
                                : "privacy_label"
                            }
                            htmlFor="anonymous"
                            onClick={() => {
                              toggleBox("anonymous");
                            }}
                          >
                            <div className="public_anony_box">
                              <div className="img l_flex">
                                <img src={s1} alt="anonymous" />
                              </div>
                              <div className="title">
                                <small>
                                  <p>Anonymous</p>
                                </small>
                              </div>
                              <div className="prefered_text">
                                <p>I want to remain anonymous</p>
                              </div>
                            </div>
                          </label>{" "}
                          <label
                            className={
                              openBox === "public"
                                ? "active privacy_label"
                                : "privacy_label"
                            }
                            htmlFor="public"
                            onClick={() => {
                              toggleBox("public");
                            }}
                          >
                            <div className="public_anony_box">
                              <div className="img l_flex">
                                <img src={s2} alt="public" />
                              </div>
                              <div className="title">
                                <small>
                                  <p>Public</p>
                                </small>
                              </div>
                              <div className="prefered_text">
                                <p>I want to include my name</p>
                              </div>
                            </div>
                          </label>{" "}
                        </div>
                      </div>
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
                )}

                {/* STEP 2: School Information */}
                {currentStep === 1 && (
                  <div className="verification_information">
                    <div className="grid_form">
                      <div className="step_description_text">
                        <div className="top_text">
                          <small>
                            <p>Please Fill in the following information</p>
                          </small>
                        </div>
                      </div>
                      <div
                        className={`form_group ${
                          touched.schoolName && errors.schoolName ? "error" : ""
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
                          <Autocomplete
                            multiple
                            id="issueType"
                            options={issueTypeOptions}
                            onChange={(_, value) =>
                              setFieldValue("issueType", value)
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                className="text_field"
                                variant="outlined"
                                error={
                                  touched.issueType && Boolean(errors.issueType)
                                }
                                placeholder="Select Issue Type"
                                sx={{
                                  "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                      border: "1px solid var(--color-gray)",
                                      borderRadius: "6px",
                                    },
                                    "&:hover fieldset": {
                                      border: "1px solid var(--color-gray)", // Remove border on hover as well
                                    },
                                    "&.Mui-focused fieldset": {
                                      border: "1px solid var(--color-gray)", // Remove border on focus
                                    },
                                  },
                                }}
                              />
                            )}
                            value={values.issueType || []}
                            isOptionEqualToValue={(option, value) =>
                              option === value
                            }
                          />
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
                )}

                {/* STEP 3: Uploads */}
                {currentStep === 2 && (
                  <div className="upload_information">
                    <div className="grid_form">
                      <div className="step_description_text">
                        <div className="top_text">
                          <small>
                            <p>Please Fill in the following information</p>
                          </small>
                        </div>
                      </div>
                      {/* IMAGE UPLOAD */}
                      <div className="image_vid_uploads_btn">
                        <div className="label">
                          <span>
                            <p>
                              Share an image that helps illustrate the problem.
                            </p>
                          </span>
                        </div>
                        <div className="upload_images_vid"></div>
                        <div className="img_vid_btn">
                          <label htmlFor="file" className="label_btn">
                            <input
                              type="file"
                              id="file"
                              style={{ display: "none" }}
                            />
                            <span className="uplaod_icon_btn a_flex">
                              <FileUploadOutlinedIcon className="icon" />
                              <small className="text">Upload</small>
                            </span>
                          </label>
                          <small className="hint">
                            <p>*Upload up to 10 files. Max 100mb per file</p>
                          </small>
                        </div>
                      </div>
                      {/* VIDEO UPLOAD */}
                      <div className="image_vid_uploads_btn">
                        <div className="label">
                          <span>
                            <p>
                              Share a video that helps illustrate the problem.
                            </p>
                          </span>
                        </div>
                        <div className="upload_images_vid"></div>
                        <div className="img_vid_btn">
                          <label htmlFor="file" className="label_btn">
                            <input
                              type="file"
                              id="file"
                              style={{ display: "none" }}
                            />
                            <span className="uplaod_icon_btn a_flex">
                              <FileUploadOutlinedIcon className="icon" />
                              <small className="text">Upload</small>
                            </span>
                          </label>
                          <small className="hint">
                            <p>*Upload 1 files. Max 10mb </p>
                          </small>
                        </div>
                      </div>

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
                                <span>Submit</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default ReportComponent;
