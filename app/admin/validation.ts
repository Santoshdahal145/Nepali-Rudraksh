import * as Yup from "yup";

export const adminLoginSchema = Yup.object({
  email: Yup.string()
    .email("Enter a valid email address")
    .required("Administrator email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});
