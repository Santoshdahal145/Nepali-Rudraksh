import * as Yup from "yup";

export const resetPasswordSchema = Yup.object({
  email: Yup.string()
    .email("Enter a valid email address")
    .required("Email address is required"),
  otp: Yup.string()
    .length(6, "OTP must be exactly 6 digits")
    .matches(/^\d{6}$/, "OTP must contain only numbers")
    .required("OTP is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Please confirm your new password"),
});
