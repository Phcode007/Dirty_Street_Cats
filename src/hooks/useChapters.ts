/* eslint-disable react-hooks/immutability */
"use client"; // ← IMPORTANTE: Indica que roda no navegador

import { useState, useEffect } from "react";
import { Chapter } from "../types/chapter";
import { storageService } from "../lib/storage";

export const useChapters = () => {
  // STATE: Lista de capítulos
  const [chapters, setChapters] = useState<Chapter[]>([]);

  // STATE: Está carregando?
  const [loading, setLoading] = useState(true);

  // EFFECT: Carrega capítulos quando componente monta
  useEffect(() => {
    loadChapters();
  }, []); // [] = executa apenas uma vez

  const loadChapters = () => {
    const data = storageService.getChapters();

    // Se não tem capítulos, cria um padrão
    if (data.length === 0) {
      const defaultChapter: Chapter = {
        id: 1,
        number: 1,
        title: "Origem",
        excerpt: "No coração sombrio de Eldor...",
        content: "<p>A chuva caía sem piedade...</p>",
      };

      storageService.saveChapters([defaultChapter]);
      setChapters([defaultChapter]);
    } else {
      setChapters(data);
    }

    setLoading(false);
  };

  const addChapter = (chapter: Chapter) => {
    storageService.addChapter(chapter);
    loadChapters(); // Recarrega a lista
  };

  const updateChapter = (id: number, chapter: Chapter) => {
    storageService.updateChapter(id, chapter);
    loadChapters();
  };

  const deleteChapter = (id: number) => {
    storageService.deleteChapter(id);
    loadChapters();
  };

  // Retorna tudo que o componente vai usar
  return {
    chapters,
    loading,
    addChapter,
    updateChapter,
    deleteChapter,
    refreshChapters: loadChapters,
  };
};
