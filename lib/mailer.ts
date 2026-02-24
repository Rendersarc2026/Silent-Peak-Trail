import nodemailer from "nodemailer";

export async function sendEnquiryConfirmationMail({
    toEmail,
    firstName,
    agencyPhone,
    agencyWebsite,
}: {
    toEmail: string;
    firstName: string;
    agencyPhone: string;
    agencyWebsite: string;
}) {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;

    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !SMTP_FROM) {
        console.warn("SMTP environment variables are not set. Skipping email sending.");
        return false;
    }

    try {
        const transporter = nodemailer.createTransport({
            host: SMTP_HOST,
            port: Number(SMTP_PORT),
            secure: Number(SMTP_PORT) === 465, // true for 465, false for other ports
            auth: {
                user: SMTP_USER,
                pass: SMTP_PASS,
            },
        });

        const textContent = `Hi ${firstName},

Thank you for choosing Silent Peak Trail.

Your booking request has been successfully received, and your journey to the mountains is already in motion. Our team is reviewing the details and will get back to you shortly with your confirmation and the next steps.

If you need any assistance in the meantime, feel free to call us at ${agencyPhone} or simply reply to this email. We’re here to make your travel experience smooth and memorable.

Warm regards,
Team Silent Peak Trail
Leh, Ladakh
Phone: ${agencyPhone}
Website: ${agencyWebsite}`;

        const info = await transporter.sendMail({
            from: SMTP_FROM,
            to: toEmail,
            subject: "Your Enquiry is Received - Silent Peak Trail",
            text: textContent,
        });

        console.log("Message sent: %s", info.messageId);
        return true;
    } catch (error) {
        console.error("Error sending enquiry confirmation email:", error);
        return false;
    }
}
export async function sendCustomEmail({
    to,
    subject,
    message,
}: {
    to: string;
    subject: string;
    message: string;
}) {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;

    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !SMTP_FROM) {
        console.warn("SMTP environment variables are not set. Skipping email sending.");
        return false;
    }

    try {
        const transporter = nodemailer.createTransport({
            host: SMTP_HOST,
            port: Number(SMTP_PORT),
            secure: Number(SMTP_PORT) === 465,
            auth: {
                user: SMTP_USER,
                pass: SMTP_PASS,
            },
        });

        const info = await transporter.sendMail({
            from: SMTP_FROM,
            to,
            subject,
            text: message,
            html: message.replace(/\n/g, "<br>"), // Simple conversion for line breaks
        });

        console.log("Custom email sent: %s", info.messageId);
        return true;
    } catch (error) {
        console.error("Error sending custom email:", error);
        return false;
    }
}
