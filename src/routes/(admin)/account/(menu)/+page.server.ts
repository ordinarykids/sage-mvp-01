// import { redirect } from "@sveltejs/kit"

// export const actions = {
//   signout: async ({ locals: { supabase, safeGetSession } }) => {
//     const { session } = await safeGetSession()
//     if (session) {
//       await supabase.auth.signOut()
//       redirect(303, "/")
//     }
//   },
// }

// import { redirect } from "@sveltejs/kit"

// import { supabase } from "$lib/supabaseClient"
import { ANTHROPIC_API_KEY } from "$env/static/private"

// export async function load() {
//   const { data: rawData } = await supabase.from("conversations").select()
//   const data = rawData?.reduce((acc: any[], curr: any) => {
//     if (acc.length === 0) {
//       return [curr]
//     }
//     const prev = acc[acc.length - 1]
//     if (prev.transcriptType === curr.transcriptType) {
//       prev.transcript += " " + curr.transcript
//       return acc
//     }
//     return [...acc, curr]
//   }, [])

//   console.log(data)
//   const analysis = await analyzeConversationWithAnthropic(data)

//   return {
//     conversations: data ?? [],
//     analysis: analysis,
//   }
// }

// // let stuff = "stuffasdasdasd"

// // export async function load() {
// //   return {
// //     stuff,
// //   }
// // }

// export const actions = {
//   signout: async ({ locals: { supabase, safeGetSession } }) => {
//     const { session } = await safeGetSession()
//     if (session) {
//       await supabase.auth.signOut()
//       redirect(303, "/")
//     }
//   },
// }

import { redirect } from "@sveltejs/kit"

// import { supabase } from "$lib/supabaseClient"

import type { PageServerLoad } from "./$types"
// import { SUPABASE_URL, SUPABASE_ANON_KEY } from "$env/static/private"

import { load_helper } from "$lib/load_helpers"

// Initialize the Supabase client with your credentials.
// const supabase = createClient(
//   "https://hmjvnrnqtnjzariitzdd.supabase.co",
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtanZucm5xdG5qemFyaWl0emRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc4NjY5NDgsImV4cCI6MjA1MzQ0Mjk0OH0.1TuqCH0V2nFS_X1yfTPksCK7c4vxj9ShiTJkcV-1bJc",
// )

// const response = await fetch("/account/api/getUserStatus")
// const { userId } = await response.json()

async function analyzeConversationWithAnthropic(conversationData: any) {
  const systemPrompt = `Analyze the following conversation and:
1. Identify the key goals, dreams, and important points
2. Select the most significant ideas
3. Create a structured system prompt that would guide a conversation about achieving these goals
4. Identify and remind the user of specific details that are important to them

Please format your response as JSON with the following structure:
{
  "keyPoints": string[],
  "significantIdeas": string[],
  "systemPrompt": string
}`

  const userPrompt = JSON.stringify(conversationData)

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-3-5-sonnet-20241022",
      messages: [
        {
          role: "user",
          content: `${systemPrompt}\n\nConversation data:\n${userPrompt}`,
        },
      ],
      max_tokens: 8192,
    }),
  })

  const result = await response.json()
  console.log(result)
  return result
}

export const load: PageServerLoad = async ({
  locals: { supabase, safeGetSession },
}) => {
  // Get the authenticated user's session
  const { session } = await safeGetSession()

  if (!session) {
    throw redirect(303, "/login") // Redirect to login if no session
  }

  // // Use the authenticated user's ID
  // const { data, error } = await supabase
  //   .from("conversations")
  //   .select("*")
  //   .eq("transcriptType", "final")
  //   .eq("userId", session.user.id)
  //   .order("created_at", { ascending: false })
  //   .limit(1000)

  const { data: rawData } = await supabase
    .from("conversations")
    .select("*")
    .eq("transcriptType", "final")
    .eq("userId", session.user.id)
    .order("created_at", { ascending: false })
    .limit(1000)

  const packedData = rawData?.reduce((acc: any[], curr: any) => {
    if (acc.length === 0) {
      return [curr]
    }
    const prev = acc[acc.length - 1]
    if (prev.transcriptType === curr.transcriptType) {
      prev.transcript += " " + curr.transcript
      return acc
    }
    return [...acc, curr]
  }, [])

  const analysis = await analyzeConversationWithAnthropic(packedData)

  return {
    conversations: packedData,
    analysis: analysis,
  }
}

// let stuff = "stuffasdasdasd"

// export async function load() {
//   return {
//     stuff,
//   }
// }

export const actions = {
  signout: async ({ locals: { supabase, safeGetSession } }) => {
    const { session } = await safeGetSession()
    if (session) {
      await supabase.auth.signOut()
      redirect(303, "/")
    }
  },
}
