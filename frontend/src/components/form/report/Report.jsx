import { registerSchema } from "../../../schema/Index";
import {
  initialRegisterValues,
  RegisterAction,
  RegisterState,
  RegisterValues,
} from "../../../types/auth/register/types";
import "./styles.scss";
import {
  Formik,
  ErrorMessage,
  Form,
  Field,
  FormikHelpers,
  FormikTouched,
  FormikErrors,
} from "formik";
import { Steps, Checkbox } from "antd";
import { useEffect, useReducer, useState } from "react";
import EastIcon from "@mui/icons-material/East";
import {
  ErrorResponse,
  getError,
  useAppContext,
} from "../../../utilities/utils/Utils";
import { toast } from "react-toastify";
import axios from "axios";
import { request } from "../../../base url/BaseUrl";

const issueTypeOptions = [
  "Infrastructure",
  "Learning Materials",
  "Pupil or Student Related",
  "Teacher Related",
];


const registerReducer = (
  state: RegisterState,
  action: RegisterAction
): RegisterState => {
  switch (action.type) {
    case "REGISTER_REQUEST":
      return { ...state, loading: true, error: "", success: false };
    case "REGISTER_SUCCESS":
      return { ...state, loading: false, success: true };
    case "REGISTER_FAIL":
      return { ...state, loading: false, error: action.payload || "" };
    default:
      return state;
  }
};
function ReportComponent() {
  const { state: appState, dispatch: ctxDispatch } = useAppContext();
  const { userInfo } = appState;

  const [isSubmitted, setIsSubmitted] = useState(false);
  // Step management
  const [currentStep, setCurrentStep] = useState<number>(0);
  //const [ticketDownloaded, setTicketDownloaded] = useState(false); // New state for ticket download

  // REGISTER HANDLER
  const [, dispatch] = useReducer(registerReducer, {
    loading: false,
    error: "",
    success: false,
  });

  useEffect(() => {
    if (userInfo) {
      setCurrentStep(3); // Set step to 3 if userInfo exists
      setIsSubmitted(true); // Optionally set isSubmitted to true
    }
  }, [userInfo]);

  // REGISTER HANDLER
  const handleSubmit = async (
    values: RegisterValues,
    actions: FormikHelpers<RegisterValues>
  ) => {
    try {
      dispatch({ type: "REGISTER_REQUEST" });

      const formData = new FormData();

      // Explicitly cast key to the union of RegisterValues keys
      for (const key in values) {
        const typedKey = key as keyof RegisterValues; // Cast key to keyof RegisterValues

        const value = values[typedKey];

        // Only append non-null values
        if (value !== null && value !== undefined) {
          if (typeof value === "boolean") {
            formData.append(typedKey, String(value)); // Convert boolean to string
          } else {
            formData.append(typedKey, value); // Append string or File
          }
        }
      }

      const response = await axios.post(
        `${request}/api/users/signup`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      dispatch({ type: "REGISTER_SUCCESS", payload: response.data });
      ctxDispatch({ type: "USER_SIGNIN", payload: response.data });
      localStorage.setItem("userInfo", JSON.stringify(response.data));

      toast.success("Registration successful!", {
        position: "bottom-center",
      });

      actions.resetForm();

      setIsSubmitted(true);
      setCurrentStep(3);
    } catch (err) {
      dispatch({
        type: "REGISTER_FAIL",
        payload: await getError(err as ErrorResponse),
      });
      toast.error(await getError(err as ErrorResponse), {
        position: "bottom-center",
      });
    } finally {
      actions.setSubmitting(false);
    }
  };



  const handleNext = async (
    validateForm: () => Promise<FormikErrors<RegisterValues>>,
    touched: FormikTouched<RegisterValues>,
    setTouched: (
      touched: FormikTouched<RegisterValues>,
      shouldValidate?: boolean
    ) => void
  ) => {
    // Validate the form
    const errors = await validateForm();

    // Filter errors for the current step
    const stepErrors = Object.keys(errors).filter((key) => {
      if (currentStep === 0) {
        return [
          "firstName",
          "lastName",
          "email",
          "phone",
          "occupation",
          "participationType",
        ].includes(key);
      } else if (currentStep === 1) {
        return [
          "dob",
          "stateOfOrigin",
          "affiliation",
          "localGovernment",
          "ninNumber",
          "ninImageFile",
        ].includes(key);
      } else if (currentStep === 2) {
        return ["competitionType", "businessCategory", "confirmation"].includes(
          key
        );
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
        newTouched[key as keyof RegisterValues] = true;
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
            initialValues={initialRegisterValues}
            validationSchema={registerSchema}
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
              handleChange,
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
                    </div>
                  </div>

                  {/* STEP 2: School Information */}
                  <div
                    className={`step ${
                      currentStep >= 1 ? "visible" : "hidden"
                    }`}
                  >
                    <div className="verification_information">
                       {/* Affiliation state */}
                       <div
                          className={`form_group ${
                            touched.affiliation && errors.affiliation
                              ? "error"
                              : ""
                          }`}
                        >
                          <span className="input_span">
                            <label htmlFor="affiliation">
                              Affiliation With Ondo State:
                              <span className="red">*</span>
                            </label>
                            <Field
                              as="select"
                              id="affiliation"
                              name="affiliation"
                              className={`input_box ${
                                touched.affiliation && errors.affiliation
                                  ? "error-border"
                                  : ""
                              }`}
                              // onChange={(e) => {
                              //   handleChange(e); // Update form values
                              // }}
                            >
                              <option value="">Select Affiliation </option>
                              {issueTypeOptions.map((option, index) => (
                                <option key={index} value={option}>
                                  {option}
                                </option>
                              ))}
                            </Field>
                          </span>
                          <ErrorMessage
                            name="affiliation"
                            component="div"
                            className="error"
                          />
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
                        {" "}
                        {/* Conditionally Render Competition Type */}
                        {values.participationType ===
                          "Physical Participant" && (
                          <div
                            className={`form_group ${
                              touched.competitionType && errors.competitionType
                                ? "error"
                                : ""
                            }`}
                          >
                            <span className="input_span">
                              <label htmlFor="competitionType">
                                Interested In:<span className="red">*</span>
                              </label>
                              <Field
                                as="select"
                                id="competitionType"
                                name="competitionType"
                                className={`input_box ${
                                  touched.competitionType &&
                                  errors.competitionType
                                    ? "error-border"
                                    : ""
                                }`}
                              >
                                <option value="">Select Interest</option>
                                {competitionTypeOptions.map((option, index) => (
                                  <option key={index} value={option}>
                                    {option}
                                  </option>
                                ))}
                              </Field>
                            </span>
                            <ErrorMessage
                              name="competitionType"
                              component="div"
                              className="error"
                            />
                          </div>
                        )}
                        {/* Conditionally Render Business Category */}
                        {values.competitionType === "Business Pitch" && (
                          <div
                            className={`form_group ${
                              touched.businessCategory &&
                              errors.businessCategory
                                ? "error"
                                : ""
                            }`}
                          >
                            <span className="input_span">
                              <label htmlFor="businessCategory">
                                Business Category:<span className="red">*</span>
                              </label>
                              <Field
                                as="select"
                                id="businessCategory"
                                name="businessCategory"
                                className={`input_box ${
                                  touched.businessCategory &&
                                  errors.businessCategory
                                    ? "error-border"
                                    : ""
                                }`}
                              >
                                <option value="">
                                  Select Business Category
                                </option>
                                {businessCategoryOptions.map(
                                  (option, index) => (
                                    <option key={index} value={option}>
                                      {option}
                                    </option>
                                  )
                                )}
                              </Field>
                            </span>
                            <ErrorMessage
                              name="businessCategory"
                              component="div"
                              className="error"
                            />
                          </div>
                        )}
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
                                  <EastIcon className="icon" />
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="lower_text">
                        <Checkbox
                          name="confirmation"
                          checked={values.confirmation}
                          onChange={handleChange}
                          className="check_box"
                        >
                          I confirm that the information provided is accurate
                          and truthful. I agree to comply with the event's rules
                          and regulations and understand that submitting false
                          information is a criminal offense.
                        </Checkbox>{" "}
                        <ErrorMessage
                          name="confirmation"
                          component="div"
                          className="error"
                        />
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
