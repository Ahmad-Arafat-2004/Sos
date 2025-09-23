import { Request, Response } from "express";
import { z } from "zod";
import { addContactMessage } from "../lib/local-contacts";

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(1),
});

export const handleContact = async (req: Request, res: Response) => {
  try {
    const parsed = contactSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({
          success: false,
          error: "Validation failed",
          details: parsed.error.errors,
        });
    }

    const payload = parsed.data;

    // Preferred: send via SendGrid if API key is present
    const SENDGRID_KEY = process.env.SENDGRID_API_KEY;
    const RECIPIENT = process.env.CONTACT_RECIPIENT || "irthbiladi@gmail.com";

    if (SENDGRID_KEY) {
      // Send via SendGrid v3 Mail Send API
      const body = {
        personalizations: [
          {
            to: [{ email: RECIPIENT }],
            subject:
              payload.subject || `New contact message from ${payload.name}`,
          },
        ],
        from: { email: payload.email },
        content: [
          {
            type: "text/plain",
            value: `Name: ${payload.name}\nEmail: ${payload.email}\nPhone: ${payload.phone || "-"}\n\nMessage:\n${payload.message}`,
          },
        ],
      };

      try {
        const resp = await fetch("https://api.sendgrid.com/v3/mail/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${SENDGRID_KEY}`,
          },
          body: JSON.stringify(body),
        });

        if (!resp.ok) {
          const text = await resp.text();
          // fallback: store locally
          addContactMessage({
            ...payload,
            sent_via: "sendgrid",
            sendgrid_status: resp.status,
            sendgrid_body: text,
          });
          return res
            .status(200)
            .json({
              success: true,
              message: "Stored locally; sendgrid returned error",
              details: text,
            });
        }

        // store a copy locally as well
        addContactMessage({ ...payload, sent_via: "sendgrid" });
        return res.json({
          success: true,
          message: "Message sent via SendGrid",
        });
      } catch (err: any) {
        // on error store
        addContactMessage({
          ...payload,
          sent_via: "sendgrid",
          error: String(err),
        });
        return res
          .status(500)
          .json({
            success: false,
            error: "Failed to send via SendGrid",
            details: String(err),
          });
      }
    }

    // If no SendGrid, store locally and return success
    addContactMessage({ ...payload, sent_via: "local" });
    return res.json({ success: true, message: "Message stored locally" });
  } catch (error: any) {
    console.error("Contact handler error", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};
