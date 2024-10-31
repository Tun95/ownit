import * as yup from "yup";

export const registerSchema = yup.object().shape({
  firstName: yup
    .string()
    .min(2, "First name is too short!")
    .max(50, "First name is too long!")
    .required("First name is required"),
  lastName: yup
    .string()
    .min(2, "Last name is too short!")
    .max(50, "Last name is too long!")
    .required("Last name is required"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(/[\W_]/, "Password must contain at least one special character")
    .required("password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), undefined], "Passwords must match")
    .required("Confirm Password is required"),
});

export const reportSchema = yup.object().shape({
  // STEP 1
  privacyPreference: yup
    .string()
    .oneOf(["public", "anonymous"])
    .required("Privacy preference is required")
    .default("public"), // Marked as required

  // STEP 2
  schoolName: yup.string().required("School name is required"),
  schoolLocation: yup.string().required("School location is required"), // Marked as required
  issueType: yup
    .array()
    .of(yup.string())
    .min(1, "At least one issue type is required") // Enforces at least one selection
    .required("At least one issue type is required"),
  description: yup.string().required("Description is required"), // Marked as required
  comment: yup.string().required("Comment is required"), // Marked as required

  // STEP 3
  images: yup
    .array()
    .of(yup.string())
    .min(1, "At least one image and max of 10 is required") // Ensures at least one image is selected
    .max(10, "You can upload a maximum of 10 images") // Sets a maximum of 10 images
    .required("At least one image is required"),
  video: yup
    .string()
    .nullable()
    .notRequired()
    .test(
      "single-video",
      "Only one video can be uploaded",
      (value) => value === null || typeof value === "string"
    ),
});

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(/[\W_]/, "Password must contain at least one special character")
    .required("password is required"),
});

export const otpSchema = yup.object().shape({
  otp: yup
    .string()
    .required("OTP is required")
    .length(6, "OTP must be exactly 6 digits"),
});

// Email Message validation schema
export const emailMessageSchema = yup.object().shape({
  subject: yup.string().required("Subject is required"),
  emailMessage: yup
    .string()
    .trim()
    .test(
      "not-empty",
      "Email message cannot be blank",
      (value) =>
        !!value && value.replace(/<\/?[^>]+(>|$)/g, "").trim().length > 0
    )
    .required("Email message is required"),
});

export const emailMessagePhysicalSchema = yup.object().shape({
  participationType: yup.string().required("Participation type is required"),
});
