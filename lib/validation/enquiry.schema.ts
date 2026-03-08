import * as yup from "yup";
import { nameText, phoneText, safeText, safeOptionalText, noHtmlError } from "./primitives";

export const enquirySchema = yup.object({
    firstName: nameText,
    lastName: yup.string().trim().required("Last name is required").min(1).max(50).matches(/^[a-zA-Z\s]*$/, noHtmlError),
    email: yup.string().trim().required("Email is required").email("Invalid email address"),
    phone: phoneText,
    packageId: yup.string().required("Please select a package"),
    travellers: safeText(1),
    month: safeText(1, 50, "Please select a month"),
    budget: safeText(1, 50, "Please select a budget"),
    message: safeOptionalText(1000),
});
