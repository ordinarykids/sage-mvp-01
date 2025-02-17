<script lang="ts">
  import { getContext } from "svelte"
  import type { Writable } from "svelte/store"

  let adminSection: Writable<string> = getContext("adminSection")
  adminSection.set("home")

  import { goto } from "$app/navigation"
  import {
    WebsiteName,
    WebsiteBaseUrl,
    WebsiteDescription,
  } from "../../../../config"

  const ldJson = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: WebsiteName,
    url: WebsiteBaseUrl,
  }
  const jsonldScript = `<script type="application/ld+json">${
    JSON.stringify(ldJson) + "<"
  }/script>`

  function handleConnectClick() {
    goto("/account/")
  }

  import Vapi from "@vapi-ai/web"
  // import { PUBLIC_VAPI_API_KEY } from "$env/static/public"

  adminSection.set("settings")

  let { data } = $props()
  let { profile } = data

  let partialMessage = $state("")
  let finalMessage = $state("")
  let displayedPartial = $state("")

  // let adminSection: Writable<string> = getContext("adminSection")
  adminSection.set("home")

  let vapi: Vapi

  function typewriterEffect(text: string) {
    let index = 0
    const intervalId = setInterval(() => {
      if (index < text.length) {
        displayedPartial = text.substring(0, index + 1)
        index++
      } else {
        clearInterval(intervalId)
      }
    }, 20) // Adjust typing speed here (milliseconds)

    return intervalId
  }

  $effect(() => {
    //console.log(data.conversations)
    //console.log("_______" + profile?.full_name)

    let combinedTranscripts = data.conversations
      .map((c) => c.transcript)
      .reverse()
      .join(" ")
    console.log("Combined Transcripts:", combinedTranscripts)

    vapi = new Vapi("431d834a-a9f4-422b-ac70-c00be149714d")
    const assistantOverrides = {
      model: {
        provider: "openai",
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "Here are the last 50 messages from the user" +
              combinedTranscripts,
          },
        ],
      },
      recordingEnabled: true,
      variableValues: {
        name: profile?.full_name || "",
      },
    }

    vapi.start("ab4bb979-c91c-4354-ae9c-b69c21073eef", assistantOverrides)

    const saveMessageToSupabaseOLD = async (message: any) => {
      // console.log("_______" + message.transcript)
      const response = await fetch("/account/api?/saveMessage", {
        method: "POST",
        body: JSON.stringify(message),
      })
      // console.log(response.body)
    }

    async function saveMessageToSupabase(message) {
      console.log(profile)
      const response = await fetch("/account/api/saveMessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: {
            transcript: message.transcript,
            transcriptType: message.transcriptType,
            created_at: new Date().toISOString(),
            role: message.role,
            message: message,
            userId: profile.id,
          },
        }),
      })

      const result = await response.json()
      //console.log(result)
    }

    let intervalId: number // To store the interval ID for cleanup

    vapi.on("message", (message) => {
      saveMessageToSupabase(message)
      if (
        message.type === "transcript" &&
        message.transcriptType === "partial"
      ) {
        partialMessage += message.transcript
      }
      //console.log(message)
      if (message.type === "transcript" && message.transcriptType === "final") {
        partialMessage = ""
        displayedPartial = ""
        finalMessage += `${message.transcript}\n`
      }
    })

    // // Function calls and transcripts will be sent via messages
    // vapi.on("message", async (message) => {
    //   console.log(message)
    //   if (
    //     message.transcriptType === "user" ||
    //     message.transcriptType === "assistant"
    //   ) {
    //     saveMessageToSupabase()
    //   }
    // })

    $effect(() => {
      if (intervalId) {
        clearInterval(intervalId)
      }
      intervalId = typewriterEffect(partialMessage)
    })

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
      stopVapi()
    }

    function stop() {
      vapi.stop()
    }
  })

  function stopVapi() {
    vapi.stop()
  }
</script>

<svelte:head>
  <title>Account</title>
</svelte:head>

<div class="fixed z-10 bottom-4 w-16 h-16">
  <button
    class="bottom-1 bg-yellow-500 hover:text-white p-2"
    onclick={() => {
      stopVapi()
    }}>STOP</button
  >
</div>

<div class="min-h-screen w-full">
  <!-- Desktop gradient background - hidden on mobile -->
  <div
    class="animate-gradient md:block fixed inset-0 bg-gradient-to-br from-pink-200 via-blue-200 to-purple-200"
  >
    <div class="flex justify-center items-center h-full">
      <div
        class="md:container sm:container md:mx-auto max-w-md overflow-y-auto max-h-[80vh] scrollbar-hide"
        id="chat-container"
      >
        <div
          class="text-center max-w-lg m-auto text-6xl md:text-2xl leading-relaxed px-8"
        >
          {#each (finalMessage + displayedPartial).split("\n") as message, i}
            {#if i === data.conversations.length && message === partialMessage}
              <div class="text-white rounded-lg p-4 mb-2 text-6xl">
                {message}
              </div>
            {:else if data.conversations[i]?.role === "assistant"}
              <div class="text-white p-4 mb-2 text-6xl">
                {message}
              </div>
            {:else}
              <div class="text-black rounded-lg p-4 mb-2">
                {message}
              </div>
            {/if}
          {/each}
        </div>
      </div>
    </div>
  </div>
</div>
