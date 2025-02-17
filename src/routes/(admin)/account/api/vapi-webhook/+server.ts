/* File: src/routes/api/vapi-webhook/+server.js */
import { json } from "@sveltejs/kit"
import { createClient } from "@supabase/supabase-js"
/**
 * This endpoint listens for POST requests, e.g. from a Vapi webhook.
 */
export async function GET({ request }) {
  console.log(request)
  try {
    // Parse the JSON payload from the webhook
    const payload = await request.json()
    console.log("Received Vapi webhook payload:", payload)

    // TODO: Process the payload as needed
    // e.g., validate data, update a database, trigger a process, etc.

    // Respond to Vapi confirming the webhook was received
    return json({ message: "Webhook received successfully" })
  } catch (error) {
    console.error("Error processing the webhook:", error)
    return json({ error: "Invalid payload" }, { status: 400 })
  }
}
