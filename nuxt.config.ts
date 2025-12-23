// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: "app",
  compatibilityDate: "2025-12-23",
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "motion-v/nuxt"],
  css: ["~/assets/css/main.css"],
  nitro: {
    preset: "cloudflare_module",
    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
    },
  },
});
