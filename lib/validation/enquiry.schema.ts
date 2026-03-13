import * as yup from "yup";
import { nameText, phoneText, emailText, safeText, safeOptionalText, noHtmlError, isSafe } from "./primitives";


export const enquirySchema = yup.object({
    firstName: nameText,
    lastName: yup.string().trim().required("Last name is required").min(1, "Please enter your last name").max(50).test("is-safe", noHtmlError, val => isSafe(val)).matches(/^[a-zA-Z\s]*$/, noHtmlError),

    email: emailText,



    phone: phoneText,
    packageId: yup.string().required("Please select a package"),
    travellers: yup.number()
        .typeError("Please enter a valid number")
        .integer("Must be a whole number")
        .min(1, "Minimum 1 traveller required")
        .required("Required"),
    month: safeText(1, 50, "Please select a month"),
    budget: safeText(1, 50, "Please select a budget"),
    message: safeOptionalText(1000),
    website_url: yup.string().max(0, "Bot detected"), // Honeypot field - must be empty
});

