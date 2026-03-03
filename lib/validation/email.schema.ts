import * as yup from "yup";
import { safeText } from "./primitives";

export const sendEmailSchema = yup.object({
    to: yup.string().trim().required("Recipient email is required").email("Invalid email address"),
    subject: safeText(2, 200),
    message: safeText(5, 5000),
});
