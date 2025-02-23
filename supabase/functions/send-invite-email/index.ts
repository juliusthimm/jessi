
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InviteEmailRequest {
  email: string;
  companyName: string;
  inviteLink: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, companyName, inviteLink }: InviteEmailRequest = await req.json();

    console.log("Sending invite email to:", email, "for company:", companyName);

    const emailResponse = await resend.emails.send({
      from: "Lovable <onboarding@resend.dev>",
      to: [email],
      subject: `Join ${companyName} on Lovable`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>You've been invited to join ${companyName}!</h1>
          <p>You've been invited to join ${companyName} on Lovable. Click the link below to accept the invitation:</p>
          <p style="margin: 24px 0;">
            <a href="${inviteLink}" 
               style="background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
              Accept Invitation
            </a>
          </p>
          <p>If you didn't expect this invitation, you can safely ignore this email.</p>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-invite-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
