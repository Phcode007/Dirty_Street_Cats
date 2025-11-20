import { useDocument } from "../hooks/useFirestore";
import { useTheme } from "../contexts/ThemeContext";
import "./InfoPages.css";

const AuthorInfo = () => {
  const { isDark } = useTheme();
  const { document: siteInfo, loading } = useDocument("settings", "siteInfo");

  if (loading) {
    return (
      <div className="info-page-container">
        <div className="loading">Carregando...</div>
      </div>
    );
  }

  return (
    <div className={`info-page-container ${isDark ? "dark" : "light"}`}>
      <div className="info-page-content">
        <h1 className="info-page-title">Sobre o Autor</h1>
        <div className="info-page-text">
          {siteInfo?.authorInfo ? (
            siteInfo.authorInfo
              .split("\n\n")
              .map((paragraph, index) => <p key={index}>{paragraph}</p>)
          ) : (
            <p>Informações sobre o autor em breve...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthorInfo;
