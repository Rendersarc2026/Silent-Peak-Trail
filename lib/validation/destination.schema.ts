import * as yup from "yup";
import { safeText, imageUrl } from "./primitives";

export const destinationSchema = yup.object({
    name: safeText(2, 100),
    type: safeText(2, 50),
    altitude: safeText(2, 50),
    img: imageUrl,
    big: yup.boolean().default(false),
});
