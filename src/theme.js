import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";

//color design tokens
export const tokens = (mode) => ({
  ...(mode === "dark"
    ? {
        eggshell: {
          100: "#fcfbf6",
          200: "#f9f7ed",
          300: "#f6f2e4",
          400: "#f3eedb",
          500: "#f0ead2",
          600: "#c0bba8",
          700: "#908c7e",
          800: "#605e54",
          900: "#302f2a",
        },
        bud: {
          100: "#f8faf0",
          200: "#f1f5e2",
          300: "#ebefd3",
          400: "#e4eac5",
          500: "#dde5b6",
          600: "#b1b792",
          700: "#85896d",
          800: "#585c49",
          900: "#2c2e24",
        },
        moss: {
          100: "#eff3e4",
          200: "#dee6c9",
          300: "#cedaae",
          400: "#bdcd93",
          500: "#adc178",
          600: "#8a9a60",
          700: "#687448",
          800: "#454d30",
          900: "#232718",
        },
        taupe: {
          100: "#eee6e1",
          200: "#ddcec2",
          300: "#cbb5a4",
          400: "#ba9d85",
          500: "#a98467",
          600: "#876a52",
          700: "#654f3e",
          800: "#443529",
          900: "#221a15",
        },
        quincy: {
          100: "#e2dedb",
          200: "#c4bcb7",
          300: "#a79b94",
          400: "#897970",
          500: "#6c584c",
          600: "#56463d",
          700: "#41352e",
          800: "#2b231e",
          900: "#16120f",
        },
      }
    : {
        eggshell: {
          100: "#302f2a",
          200: "#605e54",
          300: "#908c7e",
          400: "#c0bba8",
          500: "#f0ead2",
          600: "#f3eedb",
          700: "#f6f2e4",
          800: "#f9f7ed",
          900: "#fcfbf6",
        },
        bud: {
          100: "#2c2e24",
          200: "#585c49",
          300: "#85896d",
          400: "#b1b792",
          500: "#dde5b6",
          600: "#e4eac5",
          700: "#ebefd3",
          800: "#f1f5e2",
          900: "#f8faf0",
        },
        moss: {
          100: "#232718",
          200: "#454d30",
          300: "#687448",
          400: "#8a9a60",
          500: "#adc178",
          600: "#bdcd93",
          700: "#cedaae",
          800: "#dee6c9",
          900: "#eff3e4",
        },
        taupe: {
          100: "#221a15",
          200: "#443529",
          300: "#654f3e",
          400: "#876a52",
          500: "#a98467",
          600: "#ba9d85",
          700: "#cbb5a4",
          800: "#ddcec2",
          900: "#eee6e1",
        },
        quincy: {
          100: "#16120f",
          200: "#2b231e",
          300: "#41352e",
          400: "#56463d",
          500: "#6c584c",
          600: "#897970",
          700: "#a79b94",
          800: "#c4bcb7",
          900: "#e2dedb",
        },
      }),
});

// MUI theme settings
export const themeSettings = (mode) => {
  const colors = tokens(mode);

  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            primary: {
              main: colors.quincy[500],
            },
            secondary: {
              main: colors.eggshell[700],
            },
            neutral: {
              dark: colors.eggshell[700],
              main: colors.eggshell[500],
              light: colors.eggshell[100],
            },
            background: {
              default: colors.quincy[600],
            },
            reddish: {
              main: colors.moss[500],
            },
          }
        : {
            primary: {
              main: colors.bud[100],
            },
            secondary: {
              main: colors.moss[500],
            },
            neutral: {
              dark: colors.eggshell[100],
              main: colors.eggshell[500],
              light: colors.eggshell[700],
            },
            background: {
              default: colors.eggshell[700],
            },
          }),
    },
    typography: {
      fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 14,
      },
    },
  };
};

// context for color mode
export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

export const useMode = () => {
  const [mode, setMode] = useState("dark");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () =>
        setMode((prev) => (prev === "light" ? "dark" : "light")),
    }),
    []
  );

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return [theme, colorMode];
};
