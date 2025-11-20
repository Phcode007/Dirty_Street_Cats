import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  getPreviousChapter,
  getNextChapter,
} from "../../services/chapterService";
import "./ChapterNavigation.css";

const ChapterNavigation = ({ currentOrder }) => {
  const navigate = useNavigate();
  const [prevChapter, setPrevChapter] = useState(null);
  const [nextChapter, setNextChapter] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNavigation = async () => {
      setLoading(true);
      try {
        const [prev, next] = await Promise.all([
          getPreviousChapter(currentOrder),
          getNextChapter(currentOrder),
        ]);
        setPrevChapter(prev);
        setNextChapter(next);
      } catch (error) {
        console.error("Erro ao carregar navegação:", error);
      } finally {
        setLoading(false);
      }
    };

    loadNavigation();
  }, [currentOrder]);

  if (loading) {
    return <div className="chapter-navigation">Carregando...</div>;
  }

  return (
    <nav className="chapter-navigation">
      <div className="nav-divider" />

      <div className="nav-buttons">
        {prevChapter ? (
          <button
            className="nav-button prev"
            onClick={() => navigate(`/read/${prevChapter.id}`)}
          >
            <ChevronLeft size={20} />
            <span>
              <small>Anterior</small>
              <strong>{prevChapter.title}</strong>
            </span>
          </button>
        ) : (
          <div className="nav-button-placeholder" />
        )}

        {nextChapter ? (
          <button
            className="nav-button next"
            onClick={() => navigate(`/read/${nextChapter.id}`)}
          >
            <span>
              <small>Próximo</small>
              <strong>{nextChapter.title}</strong>
            </span>
            <ChevronRight size={20} />
          </button>
        ) : (
          <div className="nav-button-placeholder" />
        )}
      </div>
    </nav>
  );
};

export default ChapterNavigation;
