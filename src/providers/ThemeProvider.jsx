import { useState } from "react";
import { ThemeContext } from "../contexts/ThemeContext";

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") document.documentElement.classList.add("dark");
    return savedTheme || "light";
  });

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
    localStorage.setItem("theme", theme === "light" ? "dark" : "light");
    document.documentElement.classList.toggle("dark", theme === "dark");
  };

  return (
    <ThemeContext.Provider
      value={{ theme, toggleTheme, isDark: theme === "dark" }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeProvider;
