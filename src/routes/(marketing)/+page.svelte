<script lang="ts">
  import {
    WebsiteName,
    WebsiteBaseUrl,
    WebsiteDescription,
  } from "./../../config"

  let wavy = "≋" // Unicode wavy symbol
</script>

<svelte:head>
  <title>{WebsiteName}</title>
  <meta name="description" content={WebsiteDescription} />
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
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
          <h1 class="text-3xl font-bold mb-4">
            Hey, it's Sage, how are you doing?
          </h1>
          <p class="text-lg mb-6">
            Glad you found your way here. So, here is the deal.
          </p>
          <p class="text-lg mb-8">
            I am here to help you discover your true path. It may lead to places
            you never imagined or it may wind its way back to where you started.
          </p>
          <a href="/login/sign_up"
            ><button
              class="w-full bg-white text-black py-3 px-6 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >Sign Up</button
            ></a
          >

          <h1 class="text-xl mt-6">Already have an account?</h1>
          <a href="/login/sign_in"
            ><button
              class="w-full bg-white text-black py-3 px-6 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >Sign In</button
            ></a
          >
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
