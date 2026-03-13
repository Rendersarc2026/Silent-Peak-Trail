import * as yup from "yup";
import { safeText } from "./primitives";

export const lehTipSchema = yup.object({
    icon: yup.string().trim().required("Icon is required").min(1).max(50).matches(/^[a-zA-Z0-9]+$/, "Icon must be a valid icon name"),
    title: safeText(4, 100),
    desc: safeText(5, 5000),
    color: yup.string().trim().required("Color is required").min(2).max(100),
    border: yup.string().trim().required("Border is required").min(2).max(100),
    order: yup.number().integer().min(1).default(1),
});
