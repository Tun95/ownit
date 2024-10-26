import { useReducer, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import JoditEditor from "jodit-react"; 
import { Formik, Form, Field, ErrorMessage } from "formik";
import { getError, useAppContext } from "../../../utilities/utils/Utils";
import { request } from "../../../base url/BaseUrl";
import "../subcribers/styles.scss";
import { emailMessageSchema } from "../../../schema/Index";

const reducer = (state, action) => {
  switch (action.type) {
    case "SEND_EMAIL_REQUEST":
      return { ...state, loadingEmailSend: true };
    case "SEND_EMAIL_SUCCESS":
    case "SEND_EMAIL_FAIL":
      return { ...state, loadingEmailSend: false };
    default:
      return state;
  }
};

const Messages = () => {
  const editor = useRef(null); // Remove Jodit type
  const { state: appState } = useAppContext();
  const { userInfo } = appState;
  const [{ loadingEmailSend }, dispatch] = useReducer(reducer, {
    loadingEmailSend: false,
  });

  // Local state for Jodit editor content
  const [editorContent, setEditorContent] = useState("");

  // Submit handler
  const submitHandler = async (values, { resetForm, setFieldValue }) => {
    try {
      const { subject, emailMessage } = values;

      dispatch({ type: "SEND_EMAIL_REQUEST" });

      // Make your API request here
      const { data } = await axios.post(
        `${request}/api/message/send`,
        {
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
      toast.error(getError(err));
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
                subject: "",
                emailMessage: "",
              }}
              validationSchema={emailMessageSchema}
              onSubmit={submitHandler}
            >
              {({ setFieldValue, isSubmitting }) => (
                <Form className="settingsForm">
                  <div className="settingsItem">
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
        </div>
      </div>
    </div>
  );
};

export default Messages;
