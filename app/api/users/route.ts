import { headers } from "next/headers";
import { Webhook } from "svix";
import type { SupabaseWebhookEvent } from "@/lib/types/supa-base-webhook";
import { createUser } from "@/actions/user";

//let dataX = { record: { email_address: "test" } };

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    throw new Error("WEBHOOK_SECRET is not defined");
  }

  //  Get Svix headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  //  Get raw body as text (important for verification)
  const body = await req.text();

  //  Create Svix verifier
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: SupabaseWebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as SupabaseWebhookEvent;
  } catch (err) {
    console.error(" Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }

  const eventType = evt.type;
  console.log(` Received ${eventType} event`);

  if (eventType === "user.created") {
    if (eventType === "user.created") {
      const { id, username, image_url, description, email_addresses } =
        evt.data;
      const email = email_addresses?.[0]?.email_address ?? null;

      try {
        await createUser({
          id,
          username,
          image_url,
          description,
          email,
        });
        console.log("User created successfully in DB:", email);
      } catch (e) {
        throw new Error("Error creating user in DB" + e);
      }
    }
  }

  return Response.json({ message: "received!" });
}

export async function GET() {
  // Simple test endpoint ra
  return Response.json({ message: "Webhook endpoint is alive " });
}
