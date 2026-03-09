import * as yup from "yup";
import { safeText, phoneText, isSafe } from "./primitives";

export const agencyProfileSchema = yup.object({
    phone: phoneText,
    email: yup.string()
        .trim()
        .required("Email is required")
        .min(6, "Email is too short")
        .email("Invalid email address")
        .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email format")
        .test("is-safe", "Invalid email format or keyboard mashing detected", val => isSafe(val)),
    address: safeText(10, 200),
    season: safeText(2, 100),
});
