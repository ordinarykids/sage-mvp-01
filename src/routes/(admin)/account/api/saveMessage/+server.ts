// src/routes/api/conversations/+server.js

import { createClient } from "@supabase/supabase-js"
import { json } from "@sveltejs/kit"

// Ensure these environment variables are defined in your .env file or in your deployment settings.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Create a Supabase client instance
const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Expected JSON payload example:
 * {
 *   "messages": [
 *     {
 *       "id": "443",
 *       "transcript": null,
// src/routes/api/conversations/+server.js

import { createClient } from '@supabase/supabase-js';
import { json } from '@sveltejs/kit';

// Ensure these environment variables are defined in your .env file or in your deployment settings.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a Supabase client instance
const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Expected JSON payload example:
 * {
 *   "messages": [
 *     {
 *       "id": "443",
 *       "transcript": null,
 *       "transcriptType": "user",
 *       "created_at": "2025-02-01 22:32:51.53+00",
 *       "role": null,
 *       "message": "{'name': 'Mordor'}"
 *     },
 *     {
 *       "id": "444",
 *       "transcript": null,
 *       "transcriptType": "user",
 *       "created_at": "2025-02-01 22:32:53.185+00",
 *       "role": null,
 *       "message": "{'name': 'Mordor'}"
 *     }
 *     // ...more rows if needed
 *   ]
 * }
 */
export async function POST({ request }) {
  try {
    // Parse the JSON body from the request
    const body = await request.json()
    console.log(body)
    // Validate that a messages payload was provided
    if (!body || !body.messages) {
      return json({ error: "No messages provided." }, { status: 400 })
    }

    // Allow a single object or an array of objects
    const messages = Array.isArray(body.messages)
      ? body.messages
      : [body.messages]

    // Insert the messages into the "conversations" table
    const { data, error } = await supabase
      .from("conversations")
      .insert(messages)

    if (error) {
      return json({ error: error.message }, { status: 500 })
    }

    return json({ data }, { status: 200 })
  } catch (err) {
    console.error("Error in POST /api/conversations:", err)
    return json({ error: "Invalid request." }, { status: 400 })
  }
}
