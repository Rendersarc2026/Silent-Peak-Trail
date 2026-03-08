import * as yup from "yup";
import { safeText, imageUrl } from "./primitives";

export const gallerySchema = yup.object({
    src: imageUrl,
    alt: safeText(2, 100),
    wide: yup.boolean().default(false),
    tall: yup.boolean().default(false),
});
