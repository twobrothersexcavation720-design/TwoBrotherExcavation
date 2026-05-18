import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend";

const resendApiKey = Deno.env.get("RESEND_API_KEY");
console.log("RESEND_API_KEY exists:", !!resendApiKey);
const resend = new Resend(resendApiKey);

serve(async (req) => {
  // ✅ Handle CORS preflight (THIS FIXES YOUR ERROR)
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  try {
    const { email, message, clientName } = await req.json();

    console.log("Incoming request data:", { email, message, clientName });

    const data = await resend.emails.send({
     from: "2Brothers <contact@twobrothersexcavation.com>",
      to: "twobrothersexcavation720@gmail.com",
      subject: "New Contact Form Message Board",
      html: `
        <h2>New Message</h2>
        <p><strong>Name:</strong> ${clientName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p>${message}</p>
      `,
    });

    console.log("Resend response:", data);

    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    console.error("Email send error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
});