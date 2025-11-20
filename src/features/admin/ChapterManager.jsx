import { useState } from "react";
import { useCollection } from "../../hooks/useFirestore";
import { useTheme } from "../../contexts/ThemeContext";
import { Plus, Edit2, Trash2, Eye, EyeOff } from "lucide-react";
import { deleteChapter } from "../../services/chapterService";
import ChapterEditor from "./ChapterEditor";
import "./ChapterManager.css";

const ChapterManager = () => {
  const { isDark } = useTheme();
  const { documents: chapters, loading } = useCollection("chapters", "order");
  const [editingChapter, setEditingChapter] = useState(null);
  const [showEditor, setShowEditor] = useState(false);

  const handleNewChapter = () => {
    setEditingChapter(null);
    setShowEditor(true);
  };

  const handleEditChapter = (chapter) => {
    setEditingChapter(chapter);
    setShowEditor(true);
  };

  const handleDeleteChapter = async (id, title) => {
    if (window.confirm(`Tem certeza que deseja excluir "${title}"?`)) {
      try {
        await deleteChapter(id);
      } catch (error) {
        console.error("Erro ao deletar capítulo:", error);
        alert("Erro ao deletar capítulo. Tente novamente.");
      }
    }
  };

  const handleCloseEditor = () => {
    setShowEditor(false);
    setEditingChapter(null);
  };

  const handleSaveSuccess = () => {
    // O useCollection já atualiza automaticamente via onSnapshot
  };

  if (loading) {
    return (
      <div className="chapter-manager-loading">
        <div className="loading-spinner"></div>
        <p>Carregando capítulos...</p>
      </div>
    );
  }

  return (
    <div className={`chapter-manager ${isDark ? "dark" : "light"}`}>
      <div className="manager-header">
        <h2>Gerenciar Capítulos</h2>
        <button className="new-chapter-button" onClick={handleNewChapter}>
          <Plus size={20} />
          Novo Capítulo
        </button>
      </div>

      {chapters.length === 0 ? (
        <div className="no-chapters-admin">
          <p>Nenhum capítulo criado ainda.</p>
          <button className="create-first-button" onClick={handleNewChapter}>
            Criar Primeiro Capítulo
          </button>
        </div>
      ) : (
        <div className="chapters-table">
          <table>
            <thead>
              <tr>
                <th>Ordem</th>
                <th>Título</th>
                <th>Status</th>
                <th>Palavras</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {chapters.map((chapter) => (
                <tr key={chapter.id}>
                  <td className="order-cell">#{chapter.order}</td>
                  <td className="title-cell">{chapter.title}</td>
                  <td className="status-cell">
                    <span
                      className={`status-badge ${
                        chapter.published ? "published" : "draft"
                      }`}
                    >
                      {chapter.published ? (
                        <>
                          <Eye size={14} />
                          Publicado
                        </>
                      ) : (
                        <>
                          <EyeOff size={14} />
                          Rascunho
                        </>
                      )}
                    </span>
                  </td>
                  <td className="words-cell">
                    {chapter.content.split(/\s+/).filter(Boolean).length}
                  </td>
                  <td className="actions-cell">
                    <button
                      className="action-button edit"
                      onClick={() => handleEditChapter(chapter)}
                      title="Editar"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      className="action-button delete"
                      onClick={() =>
                        handleDeleteChapter(chapter.id, chapter.title)
                      }
                      title="Deletar"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showEditor && (
        <ChapterEditor
          chapter={editingChapter}
          onClose={handleCloseEditor}
          onSave={handleSaveSuccess}
        />
      )}
    </div>
  );
};

export default ChapterManager;
