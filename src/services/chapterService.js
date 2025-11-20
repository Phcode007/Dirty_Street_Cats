import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

const CHAPTERS_COLLECTION = "chapters";

// Buscar todos os capítulos
export const getAllChapters = async () => {
  try {
    const q = query(
      collection(db, CHAPTERS_COLLECTION),
      orderBy("order", "asc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Erro ao buscar capítulos:", error);
    throw error;
  }
};

// Buscar capítulo por ID
export const getChapterById = async (id) => {
  try {
    const docRef = doc(db, CHAPTERS_COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error("Capítulo não encontrado");
    }
  } catch (error) {
    console.error("Erro ao buscar capítulo:", error);
    throw error;
  }
};

// Criar novo capítulo
export const createChapter = async (chapterData) => {
  try {
    const docRef = await addDoc(collection(db, CHAPTERS_COLLECTION), {
      ...chapterData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return { id: docRef.id, ...chapterData };
  } catch (error) {
    console.error("Erro ao criar capítulo:", error);
    throw error;
  }
};

// Atualizar capítulo
export const updateChapter = async (id, chapterData) => {
  try {
    const docRef = doc(db, CHAPTERS_COLLECTION, id);
    await updateDoc(docRef, {
      ...chapterData,
      updatedAt: Timestamp.now(),
    });
    return { id, ...chapterData };
  } catch (error) {
    console.error("Erro ao atualizar capítulo:", error);
    throw error;
  }
};

// Deletar capítulo
export const deleteChapter = async (id) => {
  try {
    const docRef = doc(db, CHAPTERS_COLLECTION, id);
    await deleteDoc(docRef);
    return { id };
  } catch (error) {
    console.error("Erro ao deletar capítulo:", error);
    throw error;
  }
};

// Buscar capítulo anterior
export const getPreviousChapter = async (currentOrder) => {
  try {
    const chapters = await getAllChapters();
    const currentIndex = chapters.findIndex((ch) => ch.order === currentOrder);
    return currentIndex > 0 ? chapters[currentIndex - 1] : null;
  } catch (error) {
    console.error("Erro ao buscar capítulo anterior:", error);
    return null;
  }
};

// Buscar próximo capítulo
export const getNextChapter = async (currentOrder) => {
  try {
    const chapters = await getAllChapters();
    const currentIndex = chapters.findIndex((ch) => ch.order === currentOrder);
    return currentIndex < chapters.length - 1
      ? chapters[currentIndex + 1]
      : null;
  } catch (error) {
    console.error("Erro ao buscar próximo capítulo:", error);
    return null;
  }
};
