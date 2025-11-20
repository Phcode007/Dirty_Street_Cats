import { Sun, Moon } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import "./Controls.css";

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button className="control-button" onClick={toggleTheme}>
      {isDark ? <Sun size={24} /> : <Moon size={24} />}
    </button>
  );
};

export default ThemeToggle;
