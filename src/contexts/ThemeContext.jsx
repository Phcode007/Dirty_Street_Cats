/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme deve ser usado dentro de ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme || "dark";
  });

  const [fontSize, setFontSize] = useState(() => {
    const savedFontSize = localStorage.getItem("fontSize");
    return savedFontSize || "medium";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("fontSize", fontSize);
  }, [fontSize]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  const cycleFontSize = () => {
    const sizes = ["small", "medium", "large"];
    setFontSize((prevSize) => {
      const currentIndex = sizes.indexOf(prevSize);
      return sizes[(currentIndex + 1) % sizes.length];
    });
  };

  const value = {
    theme,
    toggleTheme,
    isDark: theme === "dark",
    fontSize,
    cycleFontSize,
    getFontSizeValue: () => {
      const sizes = { small: "16px", medium: "18px", large: "20px" };
      return sizes[fontSize];
    },
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
