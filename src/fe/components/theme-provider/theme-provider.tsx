"use client";

import classNames from "classnames";
import { createContext, FC, PropsWithChildren } from "react";
import { useCookies } from "react-cookie";
import style from "./theme-provider.module.scss";

interface ThemeProps {
  theme: "light" | "dark";
}

interface ThemeContextType extends ThemeProps {
  setTheme(value: "light" | "dark"): void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  setTheme() {
    return;
  },
});

const ThemeProvider: FC<PropsWithChildren<Partial<ThemeProps>>> = ({
  theme: initialTheme = "light",
  children,
}) => {
  const [cookie, setCookie] = useCookies(["theme"]);

  const theme = cookie?.theme || initialTheme;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme: (theme: "light" | "dark") => setCookie("theme", theme),
      }}
    >
      <div className={classNames(style[theme], "body-container")}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export { ThemeContext };

export default ThemeProvider;
