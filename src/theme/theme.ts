import { extendTheme } from "native-base";

export const THEME = extendTheme({
  colors: {
    blue: {
      700: "#364d9d",
      500: "#6471c7",
    },
    gray: {
      700: "#1a181b",
      600: "#3e3a40",
      500: "#5f5b62",
      400: "#9f9ba1",
      300: "#d9d8da",
      200: "#edecee",
      100: "#f7f7f8",
    },
    white: "#FFFFFF",
    red: {
      500: "#ee7979",
    },
  },
  fonts: {
    heading: "Karla_700Bold",
    body: "Karla_400Regular",
  },
  fontSizes: {
    xs: "12px",
    sm: "14px",
    md: "16px",
    lg: "20px",
    xl: "24px",
  },
});
