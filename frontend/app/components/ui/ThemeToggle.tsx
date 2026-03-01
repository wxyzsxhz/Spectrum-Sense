'use client';
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useLanguage } from '@/context/LanguageContext';
import eng from '@/locales/eng';
import mm from '@/locales/mm';

const translations = { eng, mm };

export function ThemeToggle() {
  const { lang, setLang } = useLanguage();
  const t = translations[lang];
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme") as "light" | "dark" | null;
    const initial = saved || "light";
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className="w-full flex gap-4 px-3 py-3 rounded-lg text-muted-foreground text-black-hover btn-blue-hover"
      >
      {theme === "light" ? (
        <>
          <Moon className="ml-2 w-4 h-4" /> {t.dark}
        </>
      ) : (
        <>
          <Sun className="ml-2 w-4 h-4" /> {t.light}
        </>
      )}
    </button>
  );
}
