import { useState, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";
import "./ProgressBar.css";

const ProgressBar = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const { isDark } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
      setScrollProgress(Math.min(progress, 100));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`progress-bar ${isDark ? "dark" : "light"}`}
      style={{ width: `${scrollProgress}%` }}
    />
  );
};

export default ProgressBar;
