import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type { ReactNode } from "react";

interface ThemeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  console.log("ThemeProvider rendered");

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved === "true";
  });

  useEffect(() => {
    console.log("Dark mode changed:", darkMode);

    document.documentElement.classList.toggle("dark", darkMode);

    console.log(
      "HTML classes:",
      document.documentElement.className
    );

    localStorage.setItem("darkMode", String(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    console.log("toggleDarkMode called");

    setDarkMode((prev) => !prev);
  };

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        toggleDarkMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider"
    );
  }

  return context;
}