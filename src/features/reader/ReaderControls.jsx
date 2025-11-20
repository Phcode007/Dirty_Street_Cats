import { ArrowUp } from "lucide-react";
import "./ReaderControls.css";

const ReaderControls = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      className="scroll-to-top"
      onClick={scrollToTop}
      aria-label="Voltar ao topo"
      title="Voltar ao topo"
    >
      <ArrowUp size={24} />
    </button>
  );
};

export default ReaderControls;
