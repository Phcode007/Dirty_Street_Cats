import { useNavigate } from "react-router-dom";
import { useCollection } from "../hooks/useFirestore";
import { useTheme } from "../contexts/ThemeContext";
import { Book, Clock } from "lucide-react";
import "./ChapterList.css";

const ChapterList = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const {
    documents: chapters,
    loading,
    error,
  } = useCollection("chapters", "order");

  // Calcular tempo estimado de leitura (250 palavras por minuto)
  const estimateReadingTime = (content) => {
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / 250);
    return minutes;
  };

  if (loading) {
    return (
      <div className="chapter-list-container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Carregando capítulos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chapter-list-container">
        <div className="error-message">
          <p>Erro ao carregar capítulos: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`chapter-list-container ${isDark ? "dark" : "light"}`}>
      <div className="chapter-list-content">
        <h1 className="chapter-list-title">Capítulos</h1>

        {chapters.length === 0 ? (
          <div className="no-chapters">
            <Book size={48} />
            <p>Nenhum capítulo publicado ainda.</p>
            <p className="subtitle">
              Em breve novos capítulos estarão disponíveis!
            </p>
          </div>
        ) : (
          <div className="chapters-grid">
            {chapters.map((chapter) => (
              <div
                key={chapter.id}
                className="chapter-card"
                onClick={() => navigate(`/read/${chapter.id}`)}
              >
                <div className="chapter-card-header">
                  <h2 className="chapter-card-title">{chapter.title}</h2>
                  <span className="chapter-order">#{chapter.order}</span>
                </div>

                <p className="chapter-excerpt">
                  {chapter.content.substring(0, 200)}...
                </p>

                <div className="chapter-card-footer">
                  <div className="chapter-meta">
                    <Clock size={16} />
                    <span>
                      {estimateReadingTime(chapter.content)} min de leitura
                    </span>
                  </div>
                  <button className="read-button">Ler Capítulo</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChapterList;
