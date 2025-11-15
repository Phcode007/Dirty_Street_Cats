// ========================================
// VARIÁVEIS GLOBAIS
// ========================================
let currentChapter = 0;
let chapters = [];

// ========================================
// INICIALIZAÇÃO
// ========================================
document.addEventListener("DOMContentLoaded", function () {
  initDarkMode();
  initScrollProgress();
  loadChapters();

  // Se estiver na página de capítulos, renderiza
  if (document.getElementById("chaptersGrid")) {
    renderChapters();
  }

  // Se estiver na página admin, renderiza lista
  if (document.getElementById("adminChaptersList")) {
    renderAdminChapters();
  }

  // Se estiver na página do leitor, carrega capítulo
  if (document.getElementById("readerContent")) {
    loadReaderChapter();
  }
});

// ========================================
// DARK MODE
// ========================================
function initDarkMode() {
  const savedMode = localStorage.getItem("dsc_darkMode");
  if (savedMode === "true") {
    document.body.classList.add("dark-mode");
    const icon = document.getElementById("themeIcon");
    if (icon) icon.className = "fas fa-sun";
  }
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  document.getElementById("themeIcon").className = isDark
    ? "fas fa-sun"
    : "fas fa-moon";
  localStorage.setItem("dsc_darkMode", isDark);
}

// ========================================
// MENU MOBILE
// ========================================
function toggleMenu() {
  document.getElementById("navLinks").classList.toggle("active");
}

// ========================================
// BARRA DE PROGRESSO
// ========================================
function initScrollProgress() {
  window.addEventListener("scroll", function () {
    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop;
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    const progressBar = document.getElementById("progressBar");
    if (progressBar) {
      progressBar.style.width = scrolled + "%";
    }
  });
}

// ========================================
// GERENCIAMENTO DE CAPÍTULOS
// ========================================
function loadChapters() {
  const saved = localStorage.getItem("dsc_chapters");
  if (saved) {
    chapters = JSON.parse(saved);
  } else {
    // Capítulo padrão
    chapters = [
      {
        id: 1,
        number: 1,
        title: "Origem",
        excerpt:
          "No coração sombrio de Eldor, onde a luz raramente penetra as vielas estreitas, uma lenda começa a se formar entre os gatos de rua...",
        content: `<p>A chuva caía sem piedade sobre as pedras irregulares da Rua dos Esquecidos. Naquele canto abandonado de Eldor, onde nem mesmo os guardas da cidade ousavam patrulhar após o crepúsculo, as sombras dançavam com vida própria.</p>
            
            <p>Entre os destroços de uma antiga taverna, um par de olhos dourados brilhava na escuridão. Não eram olhos comuns - havia neles uma inteligência antiga, um conhecimento que transcendia a simples existência animal.</p>
            
            <p>Seu nome era Sombra. Pelo menos, era assim que os outros gatos de rua o chamavam. Mas aquele não era seu verdadeiro nome, não o nome que ecoava nos corredores de sua memória fragmentada, não o nome que carregava o peso de um destino ainda não cumprido.</p>
            
            <p>Esta é a história de como um simples gato de rua descobriu que era muito mais do que aparentava. Esta é a história de Eldor, de seus segredos enterrados e de uma profecia esquecida que está prestes a se cumprir.</p>
            
            <p>Esta é a origem dos Dirty Street Cats.</p>`,
      },
    ];
    saveChaptersToStorage();
  }
}

function saveChaptersToStorage() {
  localStorage.setItem("dsc_chapters", JSON.stringify(chapters));
}

// ========================================
// RENDERIZAR CAPÍTULOS
// ========================================
function renderChapters() {
  const grid = document.getElementById("chaptersGrid");
  if (!grid) return;

  grid.innerHTML = chapters
    .map(
      (chapter) => `
        <div class="chapter-card" onclick="openReader(${chapter.id})">
            <p class="chapter-number">CAPÍTULO ${chapter.number}</p>
            <h3 class="chapter-title">${chapter.title}</h3>
            <p class="chapter-excerpt">${chapter.excerpt}</p>
        </div>
    `
    )
    .join("");
}

// ========================================
// ABRIR LEITOR
// ========================================
function openReader(chapterId) {
  localStorage.setItem("dsc_currentChapter", chapterId);
  window.location.href = "leitor.html";
}

// ========================================
// CARREGAR CAPÍTULO NO LEITOR
// ========================================
function loadReaderChapter() {
  const chapterId = parseInt(localStorage.getItem("dsc_currentChapter")) || 1;
  const chapter = chapters.find((c) => c.id === chapterId);

  if (!chapter) return;

  currentChapter = chapters.indexOf(chapter);

  document.getElementById(
    "readerChapterNum"
  ).textContent = `CAPÍTULO ${chapter.number}`;
  document.getElementById("readerChapterTitle").textContent = chapter.title;
  document.getElementById("readerContent").innerHTML = chapter.content;

  updateReaderNav();

  // Restaurar tamanho de fonte salvo
  const savedSize = localStorage.getItem("dsc_fontSize") || "medium";
  changeFontSize(savedSize);
}

function updateReaderNav() {
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  if (prevBtn && nextBtn) {
    prevBtn.style.opacity = currentChapter > 0 ? "1" : "0.3";
    prevBtn.style.pointerEvents = currentChapter > 0 ? "auto" : "none";

    nextBtn.style.opacity = currentChapter < chapters.length - 1 ? "1" : "0.3";
    nextBtn.style.pointerEvents =
      currentChapter < chapters.length - 1 ? "auto" : "none";
  }
}

function navigateChapter(direction) {
  if (direction === "prev" && currentChapter > 0) {
    currentChapter--;
  } else if (direction === "next" && currentChapter < chapters.length - 1) {
    currentChapter++;
  } else {
    return;
  }

  const chapter = chapters[currentChapter];
  localStorage.setItem("dsc_currentChapter", chapter.id);
  window.location.reload();
}

// ========================================
// CONTROLES DE LEITURA
// ========================================
function changeFontSize(size) {
  const content = document.getElementById("readerContent");
  if (content) {
    content.className = "reader-content font-" + size;
    localStorage.setItem("dsc_fontSize", size);
  }
}

// ========================================
// ADMIN - RENDERIZAR LISTA
// ========================================
function renderAdminChapters() {
  const list = document.getElementById("adminChaptersList");
  if (!list) return;

  if (chapters.length === 0) {
    list.innerHTML =
      '<li style="text-align: center; padding: 2rem;">Nenhum capítulo publicado ainda.</li>';
    return;
  }

  list.innerHTML = chapters
    .map(
      (chapter) => `
        <li class="chapter-item">
            <div>
                <strong>Capítulo ${chapter.number}:</strong> ${chapter.title}
            </div>
            <div class="chapter-actions">
                <button class="edit-btn" onclick="editChapter(${chapter.id})">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="delete-btn" onclick="deleteChapter(${chapter.id})">
                    <i class="fas fa-trash"></i> Excluir
                </button>
            </div>
        </li>
    `
    )
    .join("");
}

// ========================================
// ADMIN - SALVAR CAPÍTULO
// ========================================
function saveChapter(e) {
  e.preventDefault();

  const id = document.getElementById("editingChapterId").value;
  const number = parseInt(document.getElementById("chapterNumber").value);
  const title = document.getElementById("chapterTitle").value;
  const excerpt = document.getElementById("chapterExcerpt").value;
  const content = document.getElementById("chapterContent").value;

  // Converter quebras de linha em parágrafos
  const formattedContent = content
    .split("\n\n")
    .filter((p) => p.trim())
    .map((p) => `<p>${p.trim()}</p>`)
    .join("\n");

  const chapter = {
    id: id ? parseInt(id) : Date.now(),
    number,
    title,
    excerpt,
    content: formattedContent,
  };

  if (id) {
    const index = chapters.findIndex((c) => c.id === parseInt(id));
    chapters[index] = chapter;
  } else {
    chapters.push(chapter);
  }

  chapters.sort((a, b) => a.number - b.number);
  saveChaptersToStorage();
  renderAdminChapters();

  document.getElementById("chapterForm").reset();
  document.getElementById("editingChapterId").value = "";

  alert("Capítulo salvo com sucesso!");
}

// ========================================
// ADMIN - EDITAR CAPÍTULO
// ========================================
function editChapter(id) {
  const chapter = chapters.find((c) => c.id === id);
  if (!chapter) return;

  document.getElementById("editingChapterId").value = chapter.id;
  document.getElementById("chapterNumber").value = chapter.number;
  document.getElementById("chapterTitle").value = chapter.title;
  document.getElementById("chapterExcerpt").value = chapter.excerpt;

  // Converter HTML de volta para texto
  const plainContent = chapter.content
    .replace(/<p>/g, "")
    .replace(/<\/p>/g, "\n\n")
    .trim();

  document.getElementById("chapterContent").value = plainContent;

  // Scroll para o formulário
  document.getElementById("chapterForm").scrollIntoView({ behavior: "smooth" });
}

// ========================================
// ADMIN - DELETAR CAPÍTULO
// ========================================
function deleteChapter(id) {
  if (!confirm("Tem certeza que deseja excluir este capítulo?")) return;

  chapters = chapters.filter((c) => c.id !== id);
  saveChaptersToStorage();
  renderAdminChapters();

  alert("Capítulo excluído com sucesso!");
}

// ========================================
// ADMIN - CANCELAR EDIÇÃO
// ========================================
function cancelEdit() {
  document.getElementById("chapterForm").reset();
  document.getElementById("editingChapterId").value = "";
}
