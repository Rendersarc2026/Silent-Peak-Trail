import * as yup from "yup";
import { nameText, safeText } from "./primitives";

export const reviewSchema = yup.object({
    name: nameText,
    place: safeText(2, 100, "Place is required"),
    packageId: yup.string().required("Required"),
    rating: yup.number().integer().min(1).max(5).default(5).required("Rating is required"),
    message: safeText(10, 1000).test("no-whitespace-only", "Review message must contain at least 3 letters or numbers.", (val) => {
        if (!val) return false;
        const alphanumericCount = (val.match(/[a-zA-Z0-9]/g) || []).length;
        return alphanumericCount >= 3;
    }),
});
