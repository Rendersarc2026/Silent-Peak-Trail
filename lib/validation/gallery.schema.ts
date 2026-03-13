import * as yup from "yup";
import { safeText, imageUrl } from "./primitives";

export const gallerySchema = yup.object({
    src: imageUrl,
    alt: safeText(2, 100)
});
