<script lang="ts">
  import { Auth } from "@supabase/auth-ui-svelte"
  import { sharedAppearance, oauthProviders } from "../login_config"

  let { data } = $props()

  let wavy = "≋" // Unicode wavy symbol
</script>

<svelte:head>
  <title>Sign up</title>
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
          <h1 class="text-2xl font-bold mb-6">Sign Up</h1>
          <Auth
            supabaseClient={data.supabase}
            view="sign_up"
            redirectTo={`${data.url}/auth/callback`}
            showLinks={false}
            providers={oauthProviders}
            socialLayout="horizontal"
            appearance={sharedAppearance}
            additionalData={undefined}
          />
          <div class="text-l text-slate-800 mt-4 mb-2">
            Have an account? <a class="underline" href="/login/sign_in"
              >Sign in</a
            >.
          </div>
        </div>
        <p class="text-sm text-center text-gray-600 mt-6">
          By clicking Let's talk, you agree to our
          <a href="/terms" class="underline">Terms of Service</a> and
          <a href="/privacy" class="underline">Privacy Policy</a>.
        </p>
      </div>
    </div>
  </div>
</div>
