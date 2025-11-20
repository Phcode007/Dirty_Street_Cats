/* eslint-disable no-unused-vars */
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDocument } from "../hooks/useFirestore";
import { useTheme } from "../contexts/ThemeContext";
import ChapterNavigation from "../features/reader/ChapterNavigation";
import "./ChapterReader.css";

const ChapterReader = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDark, fontSize, getFontSizeValue } = useTheme();
  const { document: chapter, loading, error } = useDocument("chapters", id);

  useEffect(() => {
    if (chapter) {
      localStorage.setItem("lastReadChapter", chapter.id);
      localStorage.setItem("lastReadChapterTitle", chapter.title);
    }
  }, [chapter]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  if (loading) {
    return (
      <div className="chapter-reader-container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Carregando capítulo...</p>
        </div>
      </div>
    );
  }

  if (error || !chapter) {
    return (
      <div className="chapter-reader-container">
        <div className="error-message">
          <p>Capítulo não encontrado</p>
          <button onClick={() => navigate("/chapters")}>
            Voltar para Capítulos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`chapter-reader-container ${isDark ? "dark" : "light"}`}>
      <article
        className="chapter-reader-content"
        style={{ fontSize: getFontSizeValue() }}
      >
        <header className="chapter-header">
          <div className="chapter-meta-badge">Capítulo {chapter.order}</div>
          <h1 className="chapter-title">{chapter.title}</h1>
          <div className="chapter-divider" />
        </header>

        <div className="chapter-text">
          {chapter.content.split("\n\n").map((paragraph, index) => (
            <p key={index} className="chapter-paragraph">
              {paragraph}
            </p>
          ))}
        </div>

        <ChapterNavigation currentOrder={chapter.order} />
      </article>
    </div>
  );
};

export default ChapterReader;
