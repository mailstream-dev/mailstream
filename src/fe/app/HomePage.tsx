"use client";
import { useContext } from "react";
import { ThemeContext } from "../components/theme-provider/theme-provider";

export function Index() {
  const { theme, setTheme } = useContext(ThemeContext);

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  return (
    <>
      <button onClick={toggleTheme} className="primary">
        Switch theme
      </button>
      <button onClick={toggleTheme} className="error">
        Switch theme
      </button>
      <button onClick={toggleTheme} className="success">
        Switch theme
      </button>
      <button onClick={toggleTheme} className="warning">
        Switch theme
      </button>
      <input type="text" placeholder="Hello World!" />
      <button onClick={toggleTheme} className="primary">
        Switch theme
      </button>
    </>
  );
}

export default Index;
