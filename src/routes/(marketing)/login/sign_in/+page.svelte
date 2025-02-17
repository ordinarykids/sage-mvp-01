<script lang="ts">
  import { Auth } from "@supabase/auth-ui-svelte"
  import { sharedAppearance, oauthProviders } from "../login_config"

  let { data } = $props()

  let wavy = "≋" // Unicode wavy symbol

  import { goto } from "$app/navigation"
  import { onMount } from "svelte"
  import { page } from "$app/stores"

  let { supabase } = data

  onMount(() => {
    supabase.auth.onAuthStateChange((event) => {
      // Redirect to account after successful login
      if (event == "SIGNED_IN") {
        // Delay needed because order of callback not guaranteed.
        // Give the layout callback priority to update state or
        // we'll just bounch back to login when /account tries to load
        setTimeout(() => {
          goto("/account")
        }, 1)
      }
    })
  })
</script>

<svelte:head>
  <title>Sign in</title>
</svelte:head>

<div class="min-h-screen w-full">
  <!-- Main container with responsive flex -->
  <div class="flex flex-col md:flex-row w-full min-h-screen">
    <!-- Left section -->
    <div
      class="w-full md:w-1/2 bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 p-8 flex flex-col justify-center items-center"
    ></div>

    <!-- Right section -->
    <div
      class="w-full md:w-1/2 bg-white p-8 flex flex-col justify-center items-center"
    >
      <div class="max-w-md w-full space-y-8">
        <div class="text-center">
          <p class="text-2xl mb-4">{wavy}</p>
          <h1 class="text-3xl font-bold mb-4">Sign Up</h1>

          {#if $page.url.searchParams.get("verified") == "true"}
            <div role="alert" class="alert alert-success mb-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                ><path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                /></svg
              >
              <span>Email verified! Please sign in.</span>
            </div>
          {/if}
        </div>
        <h1 class="text-2xl font-bold mb-6">Sign In</h1>
        <Auth
          supabaseClient={data.supabase}
          view="sign_in"
          redirectTo={`${data.url}/auth/callback`}
          providers={oauthProviders}
          socialLayout="horizontal"
          showLinks={false}
          appearance={sharedAppearance}
          additionalData={undefined}
        />
        <div class="text-l text-slate-800 mt-4">
          <a class="underline" href="/login/forgot_password">Forgot password?</a
          >
        </div>
        <div class="text-l text-slate-800 mt-3">
          Don't have an account? <a class="underline" href="/login/sign_up"
            >Sign up</a
          >.
        </div>
      </div>
    </div>
  </div>
</div>
