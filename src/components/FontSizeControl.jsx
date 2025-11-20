import { useTheme } from "../contexts/ThemeContext";
import "./Controls.css";

const FontSizeControl = () => {
  const { cycleFontSize } = useTheme();

  return (
    <button className="control-button" onClick={cycleFontSize}>
      <span style={{ fontSize: "20px", fontWeight: "bold" }}>A</span>
    </button>
  );
};

export default FontSizeControl;
