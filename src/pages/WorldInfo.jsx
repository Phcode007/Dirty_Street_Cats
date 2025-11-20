import { useDocument } from "../hooks/useFirestore";
import { useTheme } from "../contexts/ThemeContext";
import "./InfoPages.css";

const WorldInfo = () => {
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
        <h1 className="info-page-title">Sobre o Mundo de Eldor</h1>
        <div className="info-page-text">
          {siteInfo?.worldInfo ? (
            siteInfo.worldInfo
              .split("\n\n")
              .map((paragraph, index) => <p key={index}>{paragraph}</p>)
          ) : (
            <p>Informações sobre o mundo de Eldor em breve...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorldInfo;
