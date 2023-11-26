import { defineConfig, presetUno, transformerDirectives, transformerVariantGroup } from "unocss";
// import { UserConfig } from '@unocss/core';
import presetTheme from "unocss-preset-theme";

import { PresetOrFactory } from "unocss";

// presets.push(presetAttributify()) //启用属性模式
export default defineConfig({
  presets: [
    presetUno(),
    // 由 Iconify 提供支持的纯 CSS 图标解决方案

    presetTheme({
      selectors: {
        dart: "[theme=dark]",
        test: "[theme=test]"
      },
      theme: {
        // Configure dark themes
        dark: {},
        // Configure compact themes
        test: {
          colors: {
            primary: "#333333",
            text: "#ffffff"
          }
        }
      }
    }) as PresetOrFactory
  ],
  shortcuts: [
    ["page-cantainer", "w-100vw h-100vh"],
    ["flex-center", "flex justify-center items-center flex-col"],
    ["abs-center", "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"]
  ],
  transformers: [
    transformerDirectives(), // 启用 @apply 功能
    transformerVariantGroup() // 启用 () 分组功能
  ]
});
