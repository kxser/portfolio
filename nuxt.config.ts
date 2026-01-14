// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: "app",
  compatibilityDate: "2025-12-23",
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "motion-v/nuxt", "@nuxt/image"],
  css: ["~/assets/css/main.css"],
  nitro: {
    preset: "cloudflare_module",
    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
    },
  },
});