/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Save, X } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { createChapter, updateChapter } from "../../services/chapterService";
import "./ChapterEditor.css";

const ChapterEditor = ({ chapter, onClose, onSave }) => {
  const { isDark } = useTheme();
  const [title, setTitle] = useState(chapter?.title || "");
  const [content, setContent] = useState(chapter?.content || "");
  const [order, setOrder] = useState(chapter?.order || 1);
  const [published, setPublished] = useState(chapter?.published || false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !content.trim()) {
      setError("Título e conteúdo são obrigatórios");
      return;
    }

    setLoading(true);

    try {
      const chapterData = {
        title: title.trim(),
        content: content.trim(),
        order: Number(order),
        published,
      };

      if (chapter?.id) {
        await updateChapter(chapter.id, chapterData);
      } else {
        await createChapter(chapterData);
      }

      onSave();
      onClose();
    } catch (err) {
      console.error("Erro ao salvar capítulo:", err);
      setError("Erro ao salvar capítulo. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // Calcular estatísticas do texto
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const charCount = content.length;
  const readTime = Math.ceil(wordCount / 250);

  return (
    <div className="chapter-editor-overlay">
      <div className={`chapter-editor ${isDark ? "dark" : "light"}`}>
        <div className="editor-header">
          <h2>{chapter ? "Editar Capítulo" : "Novo Capítulo"}</h2>
          <button
            className="close-button"
            onClick={onClose}
            aria-label="Fechar"
          >
            <X size={24} />
          </button>
        </div>

        {error && <div className="editor-error">{error}</div>}

        <form className="editor-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group flex-2">
              <label htmlFor="title">Título do Capítulo</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Capítulo 1: Origem"
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="order">Ordem</label>
              <input
                id="order"
                type="number"
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                min="1"
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="content">Conteúdo</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escreva o conteúdo do capítulo aqui...

Dica: Use parágrafos duplos para separar seções."
              disabled={loading}
              required
            />
          </div>

          <div className="editor-stats">
            <span>{wordCount} palavras</span>
            <span>{charCount} caracteres</span>
            <span>~{readTime} min de leitura</span>
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                disabled={loading}
              />
              <span>Publicar capítulo</span>
            </label>
          </div>

          <div className="editor-actions">
            <button
              type="button"
              className="button button-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="button button-primary"
              disabled={loading}
            >
              <Save size={20} />
              {loading ? "Salvando..." : "Salvar Capítulo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChapterEditor;
