import * as yup from "yup";
import { nameText, safeText } from "./primitives";

export const reviewSchema = yup.object({
    name: nameText,
    place: safeText(2, 100, "Place is required"),
    packageId: yup.string().required("Required"),
    rating: yup.number().integer().min(1).max(5).default(5).required("Rating is required"),
    message: safeText(4, 1000, "Please share your experience (at least 4 characters)").test("require-letters", "Your story must contain letters, not just numbers.", (val) => {
        if (!val) return false;
        const hasLetter = /[a-zA-Z]/.test(val);
        const alphanumericCount = (val.match(/[a-zA-Z0-9]/g) || []).length;
        return hasLetter && alphanumericCount >= 4;
    }),
    image: yup.string().optional(),
});
