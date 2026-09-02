import * as Yup from "yup";

export const registerSchema = Yup.object({
  firstName: Yup.string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name is too long")
    .required("First name is required"),

  lastName: Yup.string()
    .trim()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name is too long")
    .required("Last name is required"),

  email: Yup.string()
    .email("Enter a valid email address")
    .required("Email address is required"),

  phoneNumber: Yup.string()
    .trim()
    .required("Phone number is required"),

  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Please confirm your password"),
});
