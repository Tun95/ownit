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
