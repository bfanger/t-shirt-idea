/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    public: { url: "/", static: true },
    src: { url: "/dist" },
  },
  alias: {
    svelthree: "svelthree/dist/svelthree",
  },
  plugins: [
    "@snowpack/plugin-svelte",
    "@snowpack/plugin-dotenv",
    "@snowpack/plugin-sass",
    "@snowpack/plugin-webpack",
  ],
  buildOptions: {
    clean: true,
    sourcemap: true,
  },
  devOptions: {
    open: "none",
  },
};
