import { reportSchema } from "../../../schema/Index";
import "./styles.scss";
import { Formik, ErrorMessage, Form, Field } from "formik";
import { Steps } from "antd";
import { useEffect, useReducer, useRef, useState } from "react";
import { getError, useAppContext } from "../../../utilities/utils/Utils";
import { toast } from "react-toastify";
import axios from "axios";
import { request } from "../../../base url/BaseUrl";
import { useNavigate } from "react-router-dom";
import { Autocomplete, TextField } from "@mui/material";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import CloseIcon from "@mui/icons-material/Close";

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
  issueType: [],
  description: "",
  comment: "",
  images: [],
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

    case "UPLOAD_IMAGE_REQUEST":
      return { ...state, loadingImageUpload: true, errorImageUpload: "" };
    case "UPLOAD_IMAGE_SUCCESS":
      return { ...state, loadingImageUpload: false, errorImageUpload: "" };
    case "UPLOAD_IMAGE_FAIL":
      return {
        ...state,
        loadingImageUpload: false,
        errorImageUpload: action.payload,
      };

    case "UPLOAD_VIDEO_REQUEST":
      return { ...state, loadingVideoUpload: true, errorVideoUpload: "" };
    case "UPLOAD_VIDEO_SUCCESS":
      return { ...state, loadingVideoUpload: false, errorVideoUpload: "" };
    case "UPLOAD_VIDEO_FAIL":
      return {
        ...state,
        loadingVideoUpload: false,
        errorVideoUpload: action.payload,
      };

    default:
      return state;
  }
};

function ReportComponent() {
  const navigate = useNavigate();

  const { state: appState } = useAppContext();
  const { userInfo } = appState;

  const [currentStep, setCurrentStep] = useState(0);

  const [{ loadingImageUpload, loadingVideoUpload }, dispatch] = useReducer(
    reportReducer,
    {
      loading: false,
      loadingImageUpload: false,
      loadingVideoUpload: false,
      error: "",
      success: false,
    }
  );

  const [images, setImages] = useState([]);
  console.log("IMAGES:", images);

  // SUBMIT HANDLER
  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    dispatch({ type: "CREATE_REQUEST" }); // Start loading state
    try {
      const reportData = {
        ...values,
        images: images,
      };

      // Make the API call to create a new report
      const { data } = await axios.post(`${request}/api/reports`, reportData, {
        headers: {
          authorization: `Bearer ${userInfo.token}`, // Include the user's token for authentication
        },
      });

      // Dispatch success action
      dispatch({ type: "CREATE_SUCCESS", payload: data });
      toast.success("Report submitted successfully!", {
        position: "bottom-center",
      });
      navigate("/");
    } catch (error) {
      dispatch({ type: "CREATE_FAIL", payload: getError(error) });
      setErrors({ submit: getError(error) }); // Set form errors to display feedback
      toast.error(getError(error), { position: "bottom-center" }); // Show error message
    } finally {
      setSubmitting(false);
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
  const [openBox, setOpenBox] = useState("");

  const toggleBox = (method, setFieldValue) => {
    if (openBox === method) return;
    setOpenBox(method);
    setFieldValue("privacyPreference", method); // Update Formik field value
  };

  //=================
  // VIDEO UPLOAD HANDLER
  //=================
  const [videoFileName, setVideoFileName] = useState("");

  const uploadVideoHandler = async (e, setFieldValue) => {
    const file = e.target.files[0];
    if (!file) {
      return toast.error("No video selected", { position: "bottom-center" });
    }

    const bodyFormData = new FormData();
    bodyFormData.append("file", file);

    try {
      dispatch({ type: "UPLOAD_VIDEO_REQUEST" });
      const { data } = await axios.post(
        `${request}/api/upload/video`,
        bodyFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      dispatch({ type: "UPLOAD_VIDEO_SUCCESS" });
      const videoUrl = data.secure_url;
      setFieldValue("video", videoUrl);
      setVideoFileName(file.name); // Store the file name
      toast.success("Video uploaded successfully. Click update to apply it", {
        position: "bottom-center",
      });
    } catch (err) {
      dispatch({ type: "UPLOAD_VIDEO_FAIL", payload: getError(err) });
      toast.error(getError(err), { position: "bottom-center" });
      e.target.value = ""; // Reset the file input to allow re-selection of the same video
    }
  };
  const fileInputRef = useRef(null);

  const removeVideo = (setFieldValue) => {
    setFieldValue("video", ""); // Clear the video URL in Formik state
    setVideoFileName(""); // Clear the file name
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the file input value
    }
    toast.success("Video removed successfully", { position: "bottom-center" });
  };

  //=================
  // IMAGES UPLOAD
  //=================
  const uploadFileHandler = async (e, setFieldValue, values) => {
    const files = Array.from(e.target.files);
    const currentImages = values.images || []; // Safely fallback to empty array

    // Check if the total count (existing + new) exceeds 10
    if (currentImages.length + files.length > 10) {
      return toast.error("You can upload a maximum of 10 images", {
        position: "bottom-center",
      });
    }

    if (!files.length) {
      return toast.error("No files selected", { position: "bottom-center" });
    }

    dispatch({ type: "UPLOAD_IMAGE_REQUEST" });

    try {
      const uploadedImages = await Promise.all(
        files.map(async (file) => {
          const bodyFormData = new FormData();
          bodyFormData.append("file", file);

          const { data } = await axios.post(
            `${request}/api/upload/original`,
            bodyFormData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                authorization: `Bearer ${userInfo.token}`,
              },
            }
          );
          return data.secure_url;
        })
      );

      dispatch({ type: "UPLOAD_IMAGE_SUCCESS" });
      setImages((prevImages) => [...prevImages, ...uploadedImages]);

      // Update Formik field value with the uploaded images
      if (typeof setFieldValue === "function") {
        setFieldValue("images", [...currentImages, ...uploadedImages]);
      } else {
        console.error("setFieldValue is not a function");
      }

      toast.success("Images uploaded successfully", {
        position: "bottom-center",
      });
    } catch (err) {
      toast.error(getError(err), { position: "bottom-center" });
      dispatch({ type: "UPLOAD_IMAGE_FAIL" });
    } finally {
      e.target.value = ""; // Reset file input
    }
  };

  //DELETE IMAGES
  const deleteFileHandler = async (fileName) => {
    setImages(images.filter((x) => x !== fileName));
    toast.success("Image removed successfully. Click update to apply it", {
      position: "bottom-center",
    });
  };

  useEffect(() => {
    if (!userInfo) {
      navigate("/login?redirect=/report");
    }
  }, [navigate, userInfo]);

  return (
    <div className="register_component l_flex">
      <div className="content ">
        <div className="steps l_flex">
          <Steps
            className="steps_box"
            size="small"
            direction="horizontal"
            current={currentStep}
          >
            <Steps.Step
              title={
                <span>
                  Personal <span className="mobile">Information</span>
                </span>
              }
              onClick={() => handleStepClick(0)}
            />
            <Steps.Step
              title={
                <span>
                  School <span className="mobile">Information</span>
                </span>
              }
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
                            <p>Pick an option you prefer</p>
                          </small>
                        </div>
                        <div className="lower_text">
                          <p>
                            Would you like to include your name or remain
                            anonymous?
                          </p>
                        </div>
                      </div>
                      <div className="labels l_flex">
                        <div className="labels_box f_flex">
                          <label
                            className={
                              openBox === "anonymous"
                                ? "active privacy_label"
                                : "privacy_label"
                            }
                            htmlFor="anonymous"
                            onClick={() =>
                              toggleBox("anonymous", setFieldValue)
                            }
                          >
                            <div className="public_anony_box">
                              <div className="img l_flex">
                                <i className="ri-spy-line icon"></i>
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
                          </label>
                          <label
                            className={
                              openBox === "public"
                                ? "active privacy_label"
                                : "privacy_label"
                            }
                            htmlFor="public"
                            onClick={() => toggleBox("public", setFieldValue)}
                          >
                            <div className="public_anony_box">
                              <div className="img l_flex">
                                <i className="ri-eye-2-fill icon"></i>
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
                          </label>
                        </div>
                      </div>
                      <ErrorMessage
                        name="privacyPreference"
                        component="div"
                        className="error"
                      />
                      <div className="form_group visible">
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
                            placeholder="suggestions here"
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
                      <div className="form_group">
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
                        {/* MAP IMAGES NAME HERE WITH CLOSE TO REMOVE */}
                        <div className="upload_images_vid f_flex">
                          {images.map((x) => (
                            <div key={x} className="drop_zone">
                              <img src={x} alt="" className="images" />
                              <div className="icon_bg l_flex">
                                <CloseIcon
                                  onClick={() => deleteFileHandler(x)}
                                  className="icon"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="img_vid_btn">
                          <label
                            htmlFor="images"
                            className={`label_btn ${
                              loadingImageUpload ? "disbled" : ""
                            }`}
                          >
                            <input
                              type="file"
                              id="images"
                              multiple
                              style={{ display: "none" }}
                              onChange={(e) => {
                                uploadFileHandler(e, setFieldValue, values); // Pass setFieldValue and values correctly
                              }}
                            />
                            <span className="uplaod_icon_btn a_flex">
                              {loadingImageUpload ? (
                                <>
                                  <i className="fa fa-spinner fa-spin"></i>
                                  <small className="text">Uploading...</small>
                                </>
                              ) : (
                                <>
                                  <FileUploadOutlinedIcon className="icon" />
                                  <small className="text">Upload</small>
                                </>
                              )}
                            </span>
                          </label>
                          <small className="hint">
                            <p>*Upload up to 10 files. Max 100mb per file</p>
                          </small>
                        </div>
                        <ErrorMessage
                          name="images"
                          component="div"
                          className="error"
                        />
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
                        {/* SHOW VIDEO NAME HERE WITH CLOSE TO REMOVE */}
                        {/* Show the video file name and close button */}
                        {videoFileName && (
                          <div className="upload_images_vid ">
                            <span className="span_vid a_flex">
                              <span>{videoFileName}</span>
                              <button
                                type="button"
                                className="close_btn l_flex"
                                onClick={() => removeVideo(setFieldValue)}
                              >
                                <CloseIcon className="icon" />
                              </button>
                            </span>
                          </div>
                        )}
                        <div className="img_vid_btn">
                          <label htmlFor="video" className="label_btn">
                            <input
                              type="file"
                              id="video"
                              ref={fileInputRef} // Attach ref here
                              style={{ display: "none" }}
                              onChange={(e) =>
                                uploadVideoHandler(e, setFieldValue)
                              }
                            />
                            <span className="uplaod_icon_btn a_flex">
                              {loadingVideoUpload ? (
                                <>
                                  <i className="fa fa-spinner fa-spin"></i>
                                  <small className="text">Uploading...</small>
                                </>
                              ) : (
                                <>
                                  <FileUploadOutlinedIcon className="icon" />
                                  <small className="text">Upload</small>
                                </>
                              )}
                            </span>
                          </label>
                          <small className="hint">
                            <p>*Upload 1 file. Max 10mb</p>
                          </small>
                        </div>
                        <ErrorMessage
                          name="video"
                          component="div"
                          className="error"
                        />
                      </div>

                      {/* Step 3 Finish Button */}
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
                                Submitting...
                              </span>
                            ) : (
                              <span>Submit</span>
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
