import { Chapter } from "../types/chapter";

// Constantes para as chaves do localStorage
const STORAGE_KEYS = {
  CHAPTERS: "dsc_chapters",
  DARK_MODE: "dsc_darkMode",
  FONT_SIZE: "dsc_fontSize",
  LAST_CHAPTER: "dsc_lastChapter",
} as const;

export const storageService = {
  // FUNÇÃO: Buscar todos os capítulos
  getChapters: (): Chapter[] => {
    // Verifica se está no navegador (não no servidor)
    if (typeof window === "undefined") return [];

    // Busca do localStorage
    const data = localStorage.getItem(STORAGE_KEYS.CHAPTERS);

    // Se existe, converte de JSON para objeto
    return data ? JSON.parse(data) : [];
  },

  // FUNÇÃO: Salvar capítulos
  saveChapters: (chapters: Chapter[]): void => {
    if (typeof window === "undefined") return;

    // Converte objeto para JSON e salva
    localStorage.setItem(STORAGE_KEYS.CHAPTERS, JSON.stringify(chapters));
  },

  // FUNÇÃO: Adicionar novo capítulo
  addChapter: (chapter: Chapter): void => {
    const chapters = storageService.getChapters();
    chapters.push(chapter);

    // Ordena por número do capítulo
    chapters.sort((a, b) => a.number - b.number);

    storageService.saveChapters(chapters);
  },

  // FUNÇÃO: Atualizar capítulo existente
  updateChapter: (id: number, updatedChapter: Chapter): void => {
    const chapters = storageService.getChapters();

    // Encontra o índice do capítulo
    const index = chapters.findIndex((c) => c.id === id);

    if (index !== -1) {
      chapters[index] = updatedChapter;
      storageService.saveChapters(chapters);
    }
  },

  // FUNÇÃO: Deletar capítulo
  deleteChapter: (id: number): void => {
    const chapters = storageService.getChapters();

    // Filtra removendo o capítulo com esse ID
    const filtered = chapters.filter((c) => c.id !== id);

    storageService.saveChapters(filtered);
  },

  // FUNÇÃO: Buscar modo escuro
  getDarkMode: (): boolean => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(STORAGE_KEYS.DARK_MODE) === "true";
  },

  // FUNÇÃO: Salvar modo escuro
  setDarkMode: (isDark: boolean): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.DARK_MODE, String(isDark));
  },
};
