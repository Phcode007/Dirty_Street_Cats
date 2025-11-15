let currentChapter = 0;
let chapters = [];
let touchStartX = 0;
let touchEndX = 0;

const achievements = {
  firstChapter: {
    name: "Início da Jornada",
    desc: "Leu o primeiro capítulo",
    icon: "📖",
  },
  allChapters: {
    name: "Leitor Dedicado",
    desc: "Leu todos os capítulos",
    icon: "🏆",
  },
  fastReader: {
    name: "Velocista",
    desc: "Leu 5 capítulos em um dia",
    icon: "⚡",
  },
  noteTaker: { name: "Escrivão", desc: "Criou 10 anotações", icon: "📝" },
  explorer: {
    name: "Explorador",
    desc: "Visitou todas as páginas",
    icon: "🧭",
  },
};

document.addEventListener("DOMContentLoaded", function () {
  initDarkMode();
  initScrollProgress();
  loadChapters();
  highlightCurrentPage();
  checkForNewChapters();
  setupKeyboardNavigation();
  implementLazyLoading();

  if (document.getElementById("chaptersGrid")) {
    renderChapters();
  }

  if (document.getElementById("adminChaptersList")) {
    renderAdminChapters();
    renderAnalytics();
  }

  if (document.getElementById("readerContent")) {
    loadReaderChapter();
    addBackToTopButton();
    setupScrollListener();
    setupTouchNavigation();
    addNoteSystem();
  }

  if (document.getElementById("achievementsGrid")) {
    renderAchievements();
  }

  if (document.getElementById("eldorMap")) {
    setupMapInteractions();
  }

  if (document.getElementById("storyTimeline")) {
    renderTimeline();
  }
});

function highlightCurrentPage() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".nav-links a");

  navLinks.forEach((link) => {
    const linkHref = link.getAttribute("href");
    if (
      linkHref.includes(currentPage) ||
      (currentPage === "index.html" && linkHref === "index.html") ||
      (currentPage === "" && linkHref === "index.html")
    ) {
      link.classList.add("active");
    }
  });
}

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

function toggleMenu() {
  document.getElementById("navLinks").classList.toggle("active");
}

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

function loadChapters() {
  const saved = localStorage.getItem("dsc_chapters");
  if (saved) {
    chapters = JSON.parse(saved);
  } else {
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
        publishDate: "2025-01-01",
      },
    ];
    saveChaptersToStorage();
  }
}

function saveChaptersToStorage() {
  localStorage.setItem("dsc_chapters", JSON.stringify(chapters));
}

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
                ${addRatingWidget(chapter.id)}
            </div>
        `
    )
    .join("");
}

function addRatingWidget(chapterId) {
  const rating = getChapterRating(chapterId);
  return `
        <div class="rating-widget">
            <div class="stars">
                ${[1, 2, 3, 4, 5]
                  .map(
                    (star) => `
                    <span class="star ${star <= rating ? "active" : ""}" 
                          onclick="rateChapter(${chapterId}, ${star})">★</span>
                `
                  )
                  .join("")}
            </div>
        </div>
    `;
}

function rateChapter(chapterId, rating) {
  const ratings = JSON.parse(localStorage.getItem("dsc_ratings") || "{}");
  ratings[chapterId] = rating;
  localStorage.setItem("dsc_ratings", JSON.stringify(ratings));
  showNotification("Avaliação salva!");
  checkAchievements();
}

function getChapterRating(chapterId) {
  const ratings = JSON.parse(localStorage.getItem("dsc_ratings") || "{}");
  return ratings[chapterId] || 0;
}

function openReader(chapterId) {
  if (!isChapterUnlocked(chapterId)) {
    showNotification("Este capítulo será liberado em breve!");
    return;
  }
  localStorage.setItem("dsc_currentChapter", chapterId);
  window.location.href = "leitor.html";
}

function setCurrentChapter(chapterId) {
  localStorage.setItem("dsc_currentChapter", chapterId);
}

function isChapterUnlocked(chapterNumber) {
  const launchSchedule = {
    1: "2025-01-01",
    2: "2025-01-08",
    3: "2025-01-15",
  };

  const launchDate = new Date(launchSchedule[chapterNumber]);
  return new Date() >= launchDate;
}

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
  displayReadingStats();
  setupFavoriteButton(chapter.id);
  addImmersiveButton();
  addThemeSelector();
  loadComments(chapter.id);

  const savedSize = localStorage.getItem("dsc_fontSize") || "medium";
  changeFontSize(savedSize);

  const savedTheme = localStorage.getItem("dsc_theme") || "default";
  changeTheme(savedTheme);

  const savedProgress = getReadingProgress(chapter.id);
  if (savedProgress > 0) {
    setTimeout(() => {
      const content = document.getElementById("readerContent");
      content.scrollTop = (content.scrollHeight * savedProgress) / 100;
    }, 100);
  }

  updateReadingStats(chapter.id);
  checkAchievements();
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

function changeFontSize(size) {
  const content = document.getElementById("readerContent");
  if (content) {
    content.className =
      content.className.replace(/font-\w+/g, "") + " font-" + size;
    localStorage.setItem("dsc_fontSize", size);
  }
}

function changeTheme(theme) {
  const content = document.getElementById("readerContent");
  if (content) {
    content.className =
      content.className.replace(/theme-\w+/g, "") + " theme-" + theme;
    localStorage.setItem("dsc_theme", theme);
  }
}

function addImmersiveButton() {
  const immersiveBtn = document.createElement("button");
  immersiveBtn.className = "immersive-btn";
  immersiveBtn.innerHTML = '<i class="fas fa-expand"></i> Modo Imersivo';
  immersiveBtn.onclick = toggleImmersiveMode;

  const readerControls = document.querySelector(".reader-controls");
  readerControls.appendChild(immersiveBtn);
}

function toggleImmersiveMode() {
  const reader = document.querySelector(".reader-container");
  const content = document.getElementById("readerContent");
  const header = document.getElementById("header");
  const footer = document.getElementById("footer");

  reader.classList.toggle("immersive-mode");
  content.classList.toggle("immersive-mode");

  if (reader.classList.contains("immersive-mode")) {
    header.style.display = "none";
    footer.style.display = "none";
    document.querySelector(".immersive-btn").innerHTML =
      '<i class="fas fa-compress"></i> Sair do Modo Imersivo';
  } else {
    header.style.display = "block";
    footer.style.display = "block";
    document.querySelector(".immersive-btn").innerHTML =
      '<i class="fas fa-expand"></i> Modo Imersivo';
  }
}

function addThemeSelector() {
  const themeSelector = document.createElement("select");
  themeSelector.innerHTML = `
        <option value="default">Tema Padrão</option>
        <option value="parchment">Pergaminho</option>
        <option value="terminal">Terminal</option>
        <option value="night">Noite</option>
    `;
  themeSelector.onchange = (e) => changeTheme(e.target.value);

  const savedTheme = localStorage.getItem("dsc_theme") || "default";
  themeSelector.value = savedTheme;

  const readerControls = document.querySelector(".reader-controls");
  readerControls.appendChild(themeSelector);
}

function saveReadingProgress(chapterId, progress) {
  const progressData = JSON.parse(
    localStorage.getItem("dsc_readingProgress") || "{}"
  );
  progressData[chapterId] = progress;
  localStorage.setItem("dsc_readingProgress", JSON.stringify(progressData));
}

function getReadingProgress(chapterId) {
  const progressData = JSON.parse(
    localStorage.getItem("dsc_readingProgress") || "{}"
  );
  return progressData[chapterId] || 0;
}

function setupScrollListener() {
  const content = document.getElementById("readerContent");
  if (content) {
    content.addEventListener("scroll", function () {
      const chapterId = parseInt(localStorage.getItem("dsc_currentChapter"));
      const scrollTop = content.scrollTop;
      const scrollHeight = content.scrollHeight - content.clientHeight;
      const progress = (scrollTop / scrollHeight) * 100;

      saveReadingProgress(chapterId, progress);

      const backToTopBtn = document.getElementById("backToTop");
      if (scrollTop > 200) {
        backToTopBtn.classList.add("show");
      } else {
        backToTopBtn.classList.remove("show");
      }
    });
  }
}

function calculateReadingStats() {
  const content = document.getElementById("readerContent");
  const text = content.textContent || content.innerText;
  const wordCount = text.trim().split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  return { wordCount, readingTime };
}

function displayReadingStats() {
  const stats = calculateReadingStats();
  const statsElement = document.createElement("div");
  statsElement.className = "reading-stats";
  statsElement.innerHTML = `
        <span>${stats.wordCount} palavras</span>
        <span>•</span>
        <span>${stats.readingTime} min de leitura</span>
    `;

  const readerHeader = document.querySelector(".reader-header");
  readerHeader.appendChild(statsElement);
}

function setupFavoriteButton(chapterId) {
  const favoriteBtn = document.createElement("button");
  favoriteBtn.id = "favoriteBtn";
  favoriteBtn.className = "favorite-btn";
  favoriteBtn.onclick = () => toggleFavorite(chapterId);

  const readerControls = document.querySelector(".reader-controls");
  readerControls.appendChild(favoriteBtn);
  updateFavoriteButton(chapterId);
}

function toggleFavorite(chapterId) {
  let favorites = JSON.parse(localStorage.getItem("dsc_favorites") || "[]");

  if (favorites.includes(chapterId)) {
    favorites = favorites.filter((id) => id !== chapterId);
  } else {
    favorites.push(chapterId);
  }

  localStorage.setItem("dsc_favorites", JSON.stringify(favorites));
  updateFavoriteButton(chapterId);
  checkAchievements();
}

function isFavorite(chapterId) {
  const favorites = JSON.parse(localStorage.getItem("dsc_favorites") || "[]");
  return favorites.includes(chapterId);
}

function updateFavoriteButton(chapterId) {
  const btn = document.getElementById("favoriteBtn");
  if (btn) {
    if (isFavorite(chapterId)) {
      btn.innerHTML = '<i class="fas fa-heart"></i> Favoritado';
      btn.classList.add("favorited");
    } else {
      btn.innerHTML = '<i class="far fa-heart"></i> Favoritar';
      btn.classList.remove("favorited");
    }
  }
}

function addBackToTopButton() {
  const backToTop = document.createElement("button");
  backToTop.id = "backToTop";
  backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
  backToTop.className = "back-to-top";
  backToTop.onclick = () => {
    document
      .getElementById("readerContent")
      .scrollTo({ top: 0, behavior: "smooth" });
  };

  document.querySelector(".reader-container").appendChild(backToTop);
}

function setupTouchNavigation() {
  document.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  document.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });
}

function handleSwipe() {
  const swipeThreshold = 50;
  if (touchEndX < touchStartX - swipeThreshold) {
    navigateChapter("next");
  }
  if (touchEndX > touchStartX + swipeThreshold) {
    navigateChapter("prev");
  }
}

function setupKeyboardNavigation() {
  document.addEventListener("keydown", function (e) {
    if (document.getElementById("readerContent")) {
      switch (e.key) {
        case "ArrowLeft":
          navigateChapter("prev");
          break;
        case "ArrowRight":
          navigateChapter("next");
          break;
        case "f":
          const chapterId = parseInt(
            localStorage.getItem("dsc_currentChapter")
          );
          toggleFavorite(chapterId);
          break;
        case "Escape":
          if (
            document
              .querySelector(".reader-container")
              .classList.contains("immersive-mode")
          ) {
            toggleImmersiveMode();
          }
          break;
      }
    }
  });
}

function addNoteSystem() {
  const content = document.getElementById("readerContent");
  content.addEventListener("dblclick", function (e) {
    if (e.target.tagName === "P") {
      const selection = window.getSelection().toString();
      if (selection) {
        showNoteModal(selection, e.target);
      }
    }
  });
}

function showNoteModal(selectedText, paragraph) {
  const modal = document.createElement("div");
  modal.className = "note-modal";
  modal.innerHTML = `
        <h3>Adicionar Anotação</h3>
        <p><strong>Texto selecionado:</strong> "${selectedText}"</p>
        <textarea placeholder="Sua anotação..."></textarea>
        <button onclick="saveNote('${selectedText}', this.parentNode.querySelector('textarea').value, ${paragraph.dataset.id})">Salvar</button>
        <button onclick="this.parentNode.remove()">Cancelar</button>
    `;

  document.body.appendChild(modal);
}

function saveNote(selectedText, note, paragraphId) {
  const notes = JSON.parse(localStorage.getItem("dsc_notes") || "{}");
  if (!notes[paragraphId]) notes[paragraphId] = [];
  notes[paragraphId].push({ text: selectedText, note, date: new Date() });
  localStorage.setItem("dsc_notes", JSON.stringify(notes));

  document.querySelector(".note-modal").remove();
  showNotification("Anotação salva!");
  checkAchievements();
}

function loadComments(chapterId) {
  const comments = JSON.parse(localStorage.getItem("dsc_comments") || "{}");
  const chapterComments = comments[chapterId] || [];

  const commentsHTML = chapterComments
    .map(
      (comment) => `
        <div class="comment">
            <div class="comment-header">
                <span>${comment.author || "Anônimo"}</span>
                <span>${new Date(comment.date).toLocaleDateString()}</span>
            </div>
            <p>${comment.text}</p>
        </div>
    `
    )
    .join("");

  const commentsSection = document.querySelector(".chapter-comments");
  if (commentsSection) {
    commentsSection.innerHTML = `
            <h3>Comentários (${chapterComments.length})</h3>
            <div class="comment-form">
                <textarea id="commentText" placeholder="Deixe seu comentário..."></textarea>
                <button onclick="postComment(${chapterId})">Enviar Comentário</button>
            </div>
            <div class="comments-list">
                ${commentsHTML}
            </div>
        `;
  }
}

function postComment(chapterId) {
  const commentText = document.getElementById("commentText").value;
  if (!commentText.trim()) return;

  const comments = JSON.parse(localStorage.getItem("dsc_comments") || "{}");
  if (!comments[chapterId]) comments[chapterId] = [];

  comments[chapterId].push({
    text: commentText,
    author: localStorage.getItem("dsc_username") || "Anônimo",
    date: new Date(),
  });

  localStorage.setItem("dsc_comments", JSON.stringify(comments));
  loadComments(chapterId);
  document.getElementById("commentText").value = "";
  showNotification("Comentário postado!");
}

function renderAchievements() {
  const grid = document.getElementById("achievementsGrid");
  const unlocked = checkAchievements();

  grid.innerHTML = Object.entries(achievements)
    .map(([key, achievement]) => {
      const isUnlocked = unlocked.some((a) => a.name === achievement.name);
      return `
            <div class="achievement-card ${isUnlocked ? "unlocked" : "locked"}">
                <div class="achievement-icon">${achievement.icon}</div>
                <h4>${achievement.name}</h4>
                <p>${achievement.desc}</p>
            </div>
        `;
    })
    .join("");
}

function checkAchievements() {
  const unlocked = [];
  const progress = JSON.parse(
    localStorage.getItem("dsc_readingProgress") || "{}"
  );
  const notes = JSON.parse(localStorage.getItem("dsc_notes") || "{}");

  if (Object.keys(progress).length >= 1) {
    unlocked.push(achievements.firstChapter);
  }

  if (Object.keys(progress).length >= chapters.length) {
    unlocked.push(achievements.allChapters);
  }

  const noteCount = Object.values(notes).reduce(
    (total, paragraphNotes) => total + paragraphNotes.length,
    0
  );
  if (noteCount >= 10) {
    unlocked.push(achievements.noteTaker);
  }

  const today = new Date().toDateString();
  const todayRead = Object.keys(progress).filter((chapterId) => {
    const chapter = chapters.find((c) => c.id == chapterId);
    return chapter && new Date(chapter.publishDate).toDateString() === today;
  });

  if (todayRead.length >= 5) {
    unlocked.push(achievements.fastReader);
  }

  localStorage.setItem("dsc_achievements", JSON.stringify(unlocked));
  return unlocked;
}

function setupMapInteractions() {
  const map = document.getElementById("eldorMap");
  if (map) {
    map.addEventListener("click", function (e) {
      if (e.target.tagName === "AREA") {
        const location = e.target.alt;
        showLocationInfo(location);
      }
    });
  }
}

function showLocationInfo(location) {
  const locations = {
    crystallis: "Crystallis - O coração de Eldor, governado pelo Rei Hector",
    wyvernia: "Wyvernia - Terra dos draconídeos, contaminada por Agrion",
    serinrando: "Serin Rando - Reino das cerejeiras e da natureza",
    frygid: "Frygid - Terras geladas do norte",
    westelf: "Reino Élfico do Oeste - Governado pelo Rei Baldur",
  };

  showNotification(locations[location] || "Localização desconhecida");
}

function renderTimeline() {
  const timeline = document.getElementById("storyTimeline");
  if (timeline) {
    timeline.innerHTML = chapters
      .map(
        (chapter) => `
            <div class="timeline-event">
                <div class="event-dot"></div>
                <div class="event-content">
                    <h4>${chapter.title}</h4>
                    <p>Capítulo ${chapter.number}</p>
                    <p>${chapter.excerpt}</p>
                </div>
            </div>
        `
      )
      .join("");
  }
}

function checkForNewChapters() {
  const lastVisit = localStorage.getItem("dsc_lastVisit");
  const newChapters = chapters.filter(
    (chapter) => new Date(chapter.publishDate) > new Date(lastVisit)
  );

  if (newChapters.length > 0) {
    showNotification(
      `Há ${newChapters.length} novo(s) capítulo(s) disponível(is)!`
    );
  }

  localStorage.setItem("dsc_lastVisit", new Date());
}

function implementLazyLoading() {
  const images = document.querySelectorAll("img[data-src]");
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove("lazy");
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach((img) => imageObserver.observe(img));
}

function exportUserData() {
  const data = {
    favorites: JSON.parse(localStorage.getItem("dsc_favorites") || "[]"),
    progress: JSON.parse(localStorage.getItem("dsc_readingProgress") || "{}"),
    notes: JSON.parse(localStorage.getItem("dsc_notes") || "{}"),
    ratings: JSON.parse(localStorage.getItem("dsc_ratings") || "{}"),
    achievements: JSON.parse(localStorage.getItem("dsc_achievements") || "[]"),
    exportDate: new Date(),
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "dsc-backup.json";
  a.click();
  showNotification("Dados exportados com sucesso!");
}

function showNotification(message) {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  notification.classList.remove("hidden");

  setTimeout(() => {
    notification.classList.add("hidden");
  }, 3000);
}

function updateReadingStats(chapterId) {
  const stats = JSON.parse(localStorage.getItem("dsc_chapterStats") || "{}");
  if (!stats[chapterId]) stats[chapterId] = { reads: 0 };
  stats[chapterId].reads++;
  stats[chapterId].lastRead = new Date();
  localStorage.setItem("dsc_chapterStats", JSON.stringify(stats));
}

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
                    <br>
                    <small>Publicado em: ${chapter.publishDate}</small>
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

function renderAnalytics() {
  const stats = JSON.parse(localStorage.getItem("dsc_chapterStats") || "{}");
  const totalReads = Object.values(stats).reduce(
    (total, chapter) => total + (chapter.reads || 0),
    0
  );
  const totalFavorites = JSON.parse(
    localStorage.getItem("dsc_favorites") || "[]"
  ).length;
  const totalComments = Object.values(
    JSON.parse(localStorage.getItem("dsc_comments") || "{}")
  ).reduce((total, comments) => total + comments.length, 0);

  document.getElementById("analyticsDashboard").innerHTML = `
        <h3>Estatísticas da Novel</h3>
        <div class="analytics-grid">
            <div class="analytics-card">
                <div class="analytics-number">${totalReads}</div>
                <div>Total de Leituras</div>
            </div>
            <div class="analytics-card">
                <div class="analytics-number">${totalFavorites}</div>
                <div>Favoritos</div>
            </div>
            <div class="analytics-card">
                <div class="analytics-number">${totalComments}</div>
                <div>Comentários</div>
            </div>
            <div class="analytics-card">
                <div class="analytics-number">${chapters.length}</div>
                <div>Capítulos</div>
            </div>
        </div>
    `;
}

function saveChapter(e) {
  e.preventDefault();

  const id = document.getElementById("editingChapterId").value;
  const number = parseInt(document.getElementById("chapterNumber").value);
  const title = document.getElementById("chapterTitle").value.trim();
  const excerpt = document.getElementById("chapterExcerpt").value.trim();
  const content = document.getElementById("chapterContent").value.trim();
  const publishDate =
    document.getElementById("chapterPublishDate").value ||
    new Date().toISOString().split("T")[0];

  if (number < 1) {
    showNotification("❌ O número do capítulo deve ser maior que 0");
    return;
  }

  if (!title) {
    showNotification("❌ O título é obrigatório");
    return;
  }

  if (!excerpt) {
    showNotification("❌ O excerto é obrigatório");
    return;
  }

  if (!content) {
    showNotification("❌ O conteúdo é obrigatório");
    return;
  }

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
    publishDate,
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
  renderAnalytics();

  document.getElementById("chapterForm").reset();
  document.getElementById("editingChapterId").value = "";

  showNotification("✅ Capítulo salvo com sucesso!");
}

function editChapter(id) {
  const chapter = chapters.find((c) => c.id === id);
  if (!chapter) return;

  document.getElementById("editingChapterId").value = chapter.id;
  document.getElementById("chapterNumber").value = chapter.number;
  document.getElementById("chapterTitle").value = chapter.title;
  document.getElementById("chapterExcerpt").value = chapter.excerpt;
  document.getElementById("chapterPublishDate").value = chapter.publishDate;

  const plainContent = chapter.content
    .replace(/<p>/g, "")
    .replace(/<\/p>/g, "\n\n")
    .trim();

  document.getElementById("chapterContent").value = plainContent;

  document.getElementById("chapterForm").scrollIntoView({ behavior: "smooth" });
}

function deleteChapter(id) {
  if (!confirm("Tem certeza que deseja excluir este capítulo?")) return;

  chapters = chapters.filter((c) => c.id !== id);
  saveChaptersToStorage();
  renderAdminChapters();
  renderAnalytics();

  showNotification("Capítulo excluído com sucesso!");
}

function cancelEdit() {
  document.getElementById("chapterForm").reset();
  document.getElementById("editingChapterId").value = "";
}

function filterChapters() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  const cards = document.querySelectorAll(".chapter-card");

  cards.forEach((card) => {
    const title = card
      .querySelector(".chapter-title")
      .textContent.toLowerCase();
    const excerpt = card
      .querySelector(".chapter-excerpt")
      .textContent.toLowerCase();

    if (title.includes(searchTerm) || excerpt.includes(searchTerm)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

function sortChapters(sortBy) {
  let sorted = [...chapters];

  switch (sortBy) {
    case "number":
      sorted.sort((a, b) => a.number - b.number);
      break;
    case "date":
      sorted.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
      break;
    case "rating":
      sorted.sort((a, b) => getChapterRating(b.id) - getChapterRating(a.id));
      break;
  }

  chapters = sorted;
  renderChapters();

  document
    .querySelectorAll(".sort-btn")
    .forEach((btn) => btn.classList.remove("active"));
  document
    .getElementById("sort" + sortBy.charAt(0).toUpperCase() + sortBy.slice(1))
    .classList.add("active");
}

function restoreBackup() {
  const backup = localStorage.getItem("dsc_backup");
  if (backup) {
    const data = JSON.parse(backup);
    if (
      confirm(
        `Restaurar backup de ${new Date(data.timestamp).toLocaleString()}?`
      )
    ) {
      chapters = data.chapters;
      saveChaptersToStorage();
      showNotification("Backup restaurado com sucesso!");
      window.location.reload();
    }
  } else {
    showNotification("Nenhum backup encontrado");
  }
}

setInterval(() => {
  if (chapters.length > 0) {
    const backup = {
      chapters: chapters,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("dsc_backup", JSON.stringify(backup));
  }
}, 300000);
