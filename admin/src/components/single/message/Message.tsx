import { useReducer, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import JoditEditor, { Jodit } from "jodit-react"; // Import Jodit type
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import {
  ErrorResponse,
  getError,
  useAppContext,
} from "../../../utilities/utils/Utils";
import { request } from "../../../base url/BaseUrl";
import "../subcribers/styles.scss";
import { emailMessageSchema } from "../../../schema/Index";

// Options
const approvalList = ["pending", "approved", "disapproved"];
const participationTypeOptions = [
  "Physical Participant",
  "Virtual Participant",
];

const competitionTypeOptions = [
  "The Ultimate Search",
  "Talent Showcase",
  "Business Pitch",
  "None",
];

// Define the shape of the form values
interface FormValues {
  approvalStatus: string;
  participationType: string;
  competitionType: string;
  subject: string;
  emailMessage: string;
}

interface State {
  loadingEmailSend: boolean;
  loadingPhysicalEmailSend: boolean; // New state for physical participant email
}

interface SendSuccessPayload {
  status: string;
  message: string;
}

type Action =
  | { type: "SEND_EMAIL_REQUEST" }
  | { type: "SEND_EMAIL_SUCCESS"; payload: SendSuccessPayload }
  | { type: "SEND_EMAIL_FAIL" }
  | { type: "SEND_PHYSICAL_EMAIL_REQUEST" } // New action for physical participant email
  | { type: "SEND_PHYSICAL_EMAIL_SUCCESS"; payload: SendSuccessPayload }
  | { type: "SEND_PHYSICAL_EMAIL_FAIL" };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SEND_EMAIL_REQUEST":
      return { ...state, loadingEmailSend: true };
    case "SEND_EMAIL_SUCCESS":
    case "SEND_EMAIL_FAIL":
      return { ...state, loadingEmailSend: false };

    case "SEND_PHYSICAL_EMAIL_REQUEST":
      return { ...state, loadingPhysicalEmailSend: true };
    case "SEND_PHYSICAL_EMAIL_SUCCESS":
    case "SEND_PHYSICAL_EMAIL_FAIL":
      return { ...state, loadingPhysicalEmailSend: false };

    default:
      return state;
  }
};

const Messages: React.FC = () => {
  const editor = useRef<Jodit | null>(null); // Use Jodit for proper typing
  const { state: appState } = useAppContext();
  const { userInfo } = appState;
  const [{ loadingEmailSend, loadingPhysicalEmailSend }, dispatch] = useReducer(
    reducer,
    {
      loadingEmailSend: false,
      loadingPhysicalEmailSend: false, // Initialize physical email sending state
    }
  );

  // Local state for Jodit editor content
  const [editorContent, setEditorContent] = useState<string>("");

  // Submit handler
  const submitHandler = async (
    values: FormValues,
    { resetForm, setFieldValue }: FormikHelpers<FormValues>
  ) => {
    try {
      const {
        approvalStatus,
        participationType,
        competitionType,
        subject,
        emailMessage,
      } = values;

      dispatch({ type: "SEND_EMAIL_REQUEST" });

      // Make your API request here
      const { data } = await axios.post<SendSuccessPayload>(
        `${request}/api/message/send`,
        {
          participationType,
          competitionType,
          approvalStatus,
          subject,
          message: emailMessage,
        },
        {
          headers: { Authorization: `Bearer ${userInfo?.token}` },
        }
      );
      // Handle success
      dispatch({ type: "SEND_EMAIL_SUCCESS", payload: data });
      toast.success("Email sent successfully");

      // Reset the form and clear the editor content on success
      resetForm();
      setEditorContent(""); // Clear editor content
      setFieldValue("emailMessage", ""); // Clear Formik field value for emailMessage
    } catch (err) {
      dispatch({ type: "SEND_EMAIL_FAIL" });
      toast.error(getError(err as ErrorResponse));
    }
  };

  // APPROVED PHYSICAL PARTICIPANT
  const submitPhysicalEmailHandler = async () => {
    try {
      dispatch({ type: "SEND_PHYSICAL_EMAIL_REQUEST" });

      // Send email to physical participants
      const { data } = await axios.post<SendSuccessPayload>(
        `${request}/api/message/send-approved-participant`,
        {
          headers: { Authorization: `Bearer ${userInfo?.token}` },
        }
      );

      // Dispatch success action
      dispatch({ type: "SEND_PHYSICAL_EMAIL_SUCCESS", payload: data });
      toast.success("Email sent to physical participants successfully");
    } catch (err) {
      dispatch({ type: "SEND_PHYSICAL_EMAIL_FAIL" });
      toast.error(getError(err as ErrorResponse));
    }
  };

  return (
    <div className="admin_page_all admin_page_screen">
      <div className="">
        <div className="productTitleContainer">
          <h3 className="productTitle light_shadow uppercase">Message</h3>
        </div>
        <div className="subscribers">
          <div className="light_shadow">
            <h4>Send Email Message</h4>
            <Formik
              initialValues={{
                approvalStatus: "",
                participationType: "",
                competitionType: "",
                subject: "",
                emailMessage: "",
              }}
              validationSchema={emailMessageSchema}
              onSubmit={submitHandler}
            >
              {({ setFieldValue, isSubmitting, values }) => (
                <Form className="settingsForm">
                  <div className="settingsItem">
                    <div className="split_form mb mt d_flex">
                      <div className="form_box ">
                        <label htmlFor="approvalStatus">Approval Status:</label>
                        <Field
                          as="select"
                          name="approvalStatus"
                          className="select"
                        >
                          <option value="" disabled>
                            Select Approval Status
                          </option>
                          {approvalList.map((item, index) => (
                            <option value={item} key={index}>
                              {item}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage
                          name="approvalStatus"
                          component="div"
                          className="error"
                        />
                      </div>
                      {values.approvalStatus === "approved" && (
                        <div className="form_box">
                          <label htmlFor="participationType">
                            Participation Type:
                          </label>
                          <Field
                            as="select"
                            name="participationType"
                            className="select"
                          >
                            <option value="" disabled>
                              Select Participation Type
                            </option>
                            {participationTypeOptions.map((item, index) => (
                              <option value={item} key={index}>
                                {item}
                              </option>
                            ))}
                          </Field>
                          <ErrorMessage
                            name="participationType"
                            component="div"
                            className="error"
                          />
                        </div>
                      )}
                      {values.participationType === "Physical Participant" && (
                        <div className="form_box">
                          <label htmlFor="competitionType">
                            Competition Type:
                          </label>
                          <Field
                            as="select"
                            name="competitionType"
                            className="select"
                          >
                            <option value="" disabled>
                              Select Competition Type
                            </option>
                            {competitionTypeOptions.map((item, index) => (
                              <option value={item} key={index}>
                                {item}
                              </option>
                            ))}
                          </Field>
                          <ErrorMessage
                            name="competitionType"
                            component="div"
                            className="error"
                          />
                        </div>
                      )}
                    </div>
                    <div className="form_box mb">
                      <Field
                        type="text"
                        name="subject"
                        className="input_box"
                        placeholder="Subject e.g. newsletter"
                      />
                      <ErrorMessage
                        name="subject"
                        component="div"
                        className="error"
                      />
                    </div>
                    <div className="form_box">
                      <JoditEditor
                        ref={editor}
                        value={editorContent}
                        onBlur={(newContent) => {
                          setEditorContent(newContent); // Update local state
                          setFieldValue("emailMessage", newContent); // Update Formik field
                        }}
                      />
                      <ErrorMessage
                        name="emailMessage"
                        component="div"
                        className="error"
                      />
                    </div>
                    <div className="settings_btn">
                      <button
                        className="add_btn sendButton"
                        disabled={isSubmitting || loadingEmailSend}
                      >
                        {loadingEmailSend ? (
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
                </Form>
              )}
            </Formik>
          </div>

          {/* PHYSICAL PARTICIPANT */}
          <div className="light_shadow">
            <h4>Send Email Template To:</h4>

            <div className="settingsItem">
              <div className="form_box">
                <label htmlFor="participationType">Participation Type:</label>
                <select disabled name="participationType" className="select">
                  <option value="" disabled>
                    Select Participation Type
                  </option>
                  {participationTypeOptions.map((item, index) => (
                    <option value={""} key={index}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div className="settings_btn">
                <button
                  className="add_btn sendButton"
                  onClick={submitPhysicalEmailHandler} // Attach the handler
                  disabled={loadingPhysicalEmailSend}
                >
                  {loadingPhysicalEmailSend ? (
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
        </div>
      </div>
    </div>
  );
};

export default Messages;
