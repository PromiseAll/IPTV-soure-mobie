import { resolve } from "node:path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import UnoCSS from "unocss/vite";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { VarletUIResolver } from "unplugin-vue-components/resolvers";
import { viteSingleFile } from "vite-plugin-singlefile";
const alias = {
  "@": resolve("src")
};
export default defineConfig({
  resolve: {
    alias
  },
  plugins: [
    vue(),
    vueJsx(),
    UnoCSS(),
    AutoImport({
      imports: ["vue", "@vueuse/core", "vue-router"],
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
    port: 1024,
    host: "0.0.0.0"
  }
});
