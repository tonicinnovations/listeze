// v1.14c — Contact form endpoint via Resend
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
});

export async function POST(request: Request) {
  try {
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { message: "Email service not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { name, email, message } = contactSchema.parse(body);

    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "ListEze <support@send.listeze.com>",
      to: process.env.ADMIN_EMAIL_ALLOWLIST?.split(",")[0] || "support@listeze.com",
      replyTo: email,
      subject: `ListEze Contact: ${name}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
        <hr>
        <p><small>Sent from ListEze contact form</small></p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid form data" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to send" },
      { status: 500 }
    );
  }
}
