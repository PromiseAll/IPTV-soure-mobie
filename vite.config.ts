import { resolve } from "node:path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import UnoCSS from "unocss/vite";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { VarletUIResolver } from "unplugin-vue-components/resolvers";
import { viteSingleFile } from "vite-plugin-singlefile";
import legacy from "@vitejs/plugin-legacy";
const alias = {
  "@": resolve("src")
};
export default defineConfig({
  resolve: {
    alias
  },
  plugins: [
    // legacy({
    //   targets: ["defaults", "not IE 11"],
    //   polyfills:false
    //   // renderModernChunks: false
    // }),
    vue(),
    vueJsx(),
    UnoCSS(),
    AutoImport({
      imports: [
        "vue",
        "@vueuse/core",
        "vue-router",
        {
          "my-deferred": [["default", "Deferred"]]
        }
      ],
      resolvers: [VarletUIResolver({ autoImport: true })],
      dts: "./src/types/auto-imports.d.ts"
    }),
    Components({
      resolvers: [VarletUIResolver()],
      dts: "./src/types/components.d.ts"
    }),
    process.env.NODE_ENV === "production" && viteSingleFile()
  ],
  server: {
    port: 2014,
    host: "0.0.0.0"
  }
});
