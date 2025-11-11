/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";

export const useDarkMode = () => {
  // STATE: Está no modo escuro?
  const [isDark, setIsDark] = useState(false);

  // EFFECT: Carrega preferência salva quando componente monta
  useEffect(() => {
    // Busca do localStorage
    const saved = localStorage.getItem("dsc_darkMode") === "true";
    setIsDark(saved);

    // Aplica classe no HTML
    if (saved) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  // FUNÇÃO: Alterna entre claro e escuro
  const toggle = () => {
    const newValue = !isDark;
    setIsDark(newValue);

    // Salva no localStorage
    localStorage.setItem("dsc_darkMode", String(newValue));

    // Adiciona/remove classe 'dark' no <html>
    if (newValue) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return { isDark, toggle };
};
