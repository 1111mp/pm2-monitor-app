import { fontFamily } from "tailwindcss/defaultTheme";
import { nextui } from "@nextui-org/theme";

import { type Config } from "tailwindcss";

export default {
  content: [
    "./src/**/*.tsx",
    "./node_modules/@nextui-org/theme/dist/components/(breadcrumbs|button|card|navbar|spacer|tabs).js",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
    },
  },
  plugins: [
    nextui({
      layout: {
        // https://nextui.org/docs/customization/layout#units
        spacingUnit: 3,
      },
      // themes: {
      //   light: {
      //     colors: {
      //       background: "#ffffff",
      //     },
      //   },
      //   dark: {
      //     colors: {
      //       background: "#18181B",
      //     },
      //   },
      // },
    }),
  ],
} satisfies Config;
