import * as yup from "yup";
import { safeText, phoneText } from "./primitives";

export const agencyProfileSchema = yup.object({
    phone: phoneText,
    email: yup.string().trim().email("Invalid email address").required("Email is required"),
    address: safeText(10, 200),
    season: safeText(2, 100),
});
