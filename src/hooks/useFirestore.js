/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../services/firebase";

// Hook para buscar coleção em tempo real
export const useCollection = (collectionName, orderByField = null) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);

    let q = collection(db, collectionName);

    if (orderByField) {
      q = query(q, orderBy(orderByField));
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const results = [];
        snapshot.docs.forEach((doc) => {
          results.push({ id: doc.id, ...doc.data() });
        });
        setDocuments(results);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Erro ao buscar coleção:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionName, orderByField]);

  return { documents, loading, error };
};

// Hook para buscar documento específico
export const useDocument = (collectionName, documentId) => {
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!documentId) {
      setLoading(false);
      return;
    }

    const fetchDocument = async () => {
      try {
        setLoading(true);
        const docRef = doc(db, collectionName, documentId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setDocument({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError("Documento não encontrado");
        }
        setLoading(false);
      } catch (err) {
        console.error("Erro ao buscar documento:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDocument();
  }, [collectionName, documentId]);

  return { document, loading, error };
};
