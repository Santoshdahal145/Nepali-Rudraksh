import * as Yup from "yup";

export const changePasswordValidation=Yup.object({
      currentPassword: Yup.string().required("Current password is required"),

      newPassword: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("New password is required"),

      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword")], "Passwords do not match")
        .required("Please confirm your new password"),
    })


 export const adminProfileValidation=Yup.object({
      firstName: Yup.string()
        .trim()
        .min(2, "First name must be at least 2 characters")
        .max(100, "First name is too long")
        .required("First name is required"),

      lastName: Yup.string()
        .trim()
        .min(2, "Last name must be at least 2 characters")
        .max(100, "Last name is too long")
        .required("Last name is required"),

      email: Yup.string()
        .email("Enter a valid email address")
        .required("Email is required"),

      phoneNumber: Yup.string().trim().required("Phone number is required"),
    })

export const storeSettingsValidation=Yup.object({
      storeName: Yup.string()
        .trim()
        .min(2, "Store name must be at least 2 characters")
        .required("Store name is required"),

      customerSupportEmail: Yup.string()
        .email("Enter a valid support email")
        .required("Support email is required"),

      standardConsecrationFee: Yup.number()
        .typeError("Enter a valid amount")
        .min(0, "Fee cannot be negative")
        .required("Consecration fee is required"),

      freeShippingThreshold: Yup.number()
        .typeError("Enter a valid amount")
        .min(0, "Threshold cannot be negative")
        .required("Shipping threshold is required"),

      primaryTempleConsecrationOrigin: Yup.string()
        .trim()
        .min(2, "Temple origin must be at least 2 characters")
        .required("Temple origin is required"),
    })

