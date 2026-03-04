document.addEventListener("DOMContentLoaded", () => {
  const scripts = document.getElementsByTagName("script");
  let rootPath = "./";
  for (let script of scripts) {
    if (script.src.includes("components.js")) {
      rootPath = script.getAttribute("data-root") || "./";
      break;
    }
  }


  // Inject Footer with SVGs instead of Lordicon
  const footerTemplate = `
      <div class="footer-links">

      <a href="${rootPath}../index.html" class="social-link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
          Portfolio
        </a>
        <a href="${rootPath}../Store/index.html" class="social-link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
          Shop
        </a>
        
        <a href="https://github.com/usaihack" target="_blank" class="social-link">
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
          GitHub
        </a>
        <a href="https://www.linkedin.com/in/usman701441070" target="_blank" class="social-link">
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0h.003z"/></svg>
          LinkedIn
        </a>

        <a href="mailto:70-1-4-4-10-70@proton.me" target="_blank" rel="noopener" class="social-link">
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
          Email
        </a>
      </div>
      <p class="footer-copy">&copy; 2026 Muhammad Usman Said</p>
    `;

  const isHubPage = !!document.querySelector(".tree-folder");
  const isLessonPage = !isHubPage && !!document.querySelector(".page-nav");
  const isIntroPage = window.location.pathname.endsWith("intro.html");

  const topbars = document.querySelectorAll(".topbar");
  
  if (isLessonPage) {
    let courseHub = "../intro.html";
    if (window.location.pathname.includes("Month-01-Kali-Basics")) {
      courseHub = "../kali.html";
    } else if (window.location.pathname.includes("Month-02-Networking-Basics")) {
      courseHub = "../networking.html";
    }
    
    topbars.forEach((tb) => {
      tb.innerHTML = `<a href="${courseHub}">&#8592; Back to Course</a>`;
    });
  } else if (isIntroPage) {
    topbars.forEach((tb) => {
      tb.innerHTML = "";
      tb.style.display = "none";
    });
  } else if (isHubPage) {
    topbars.forEach((tb) => {
      tb.innerHTML = `<a href="intro.html">&#8592; Learning Hub</a>`;
      tb.style.display = "flex";
    });
  }

  const footers = document.querySelectorAll(".page-footer");
  footers.forEach((ft) => (ft.innerHTML = footerTemplate));

  // --- PROGRESS TRACKING LOGIC ---

  // Inject CSS for Progress Tracking
  const style = document.createElement("style");
  style.innerHTML = `
    .track-status-badge { font-size: 0.75rem; padding: 0.2rem 0.6rem; border-radius: 12px; margin-left: auto; font-weight: 600; white-space: nowrap; }
    .track-not-started { background: rgba(255,255,255,0.05); color: rgba(212,224,237,0.5); }
    .track-in-progress { background: rgba(0, 128, 255, 0.15); color: var(--secondary, #0080ff); }
    .track-completed { background: rgba(0, 255, 159, 0.15); color: var(--accent, #00ff9f); }
    
    .course-progress-container { margin: 1.5rem auto 0; max-width: 400px; background: var(--bg2, #0f1923); padding: 1rem; border-radius: 12px; border: 1px solid var(--border, rgba(0,255,159,0.15)); }
    .course-progress-header { display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.6rem; color: var(--text); font-weight: 500;}
    .course-progress-bar { height: 8px; background: rgba(255,255,255,0.05); border-radius: 4px; overflow: hidden; }
    .course-progress-fill { height: 100%; background: var(--accent, #00ff9f); width: 0%; transition: width 0.5s ease-out; }
    
    .mark-complete-btn { display: flex; align-items: center; justify-content: center; gap: 0.5rem; width: 100%; max-width: 300px; margin: 2rem auto; padding: 0.8rem; background: transparent; border: 1px solid var(--accent, #00ff9f); color: var(--accent, #00ff9f); border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 1rem; transition: all 0.3s; font-family: inherit; }
    .mark-complete-btn:hover { background: rgba(0,255,159,0.1); }
    .mark-complete-btn.is-completed { background: var(--accent, #00ff9f); color: var(--bg, #0a0e17); pointer-events: none; }
  `;
  document.head.appendChild(style);

  // Initialize progress data
  let progressData = JSON.parse(localStorage.getItem("learningProgress")) || {};

  if (isHubPage) {
    const courseFiles = document.querySelectorAll(".tree-file");
    let completedCount = 0;
    let trackableFilesCount = 0;

    courseFiles.forEach((fileLink) => {
      const href = fileLink.getAttribute("href");
      
      // Skip external links or non-html files
      if (!href || href.startsWith("http")) return;
      
      const isQuoteFile = href.toLowerCase().includes("quote");

      // Only count towards course progress if it's NOT a quote
      if (!isQuoteFile) {
        trackableFilesCount++;
      }

      const fileKey = decodeURIComponent(href);
      let status = progressData[fileKey] || "not-started";

      let statusText = isQuoteFile ? "Not viewed" : "Not started";
      let statusClass = "track-not-started";

      if (!isQuoteFile && status === "in-progress") {
        statusText = "In progress";
        statusClass = "track-in-progress";
      } else if (status === "completed") {
        // If it's a quote, visually display "Viewed" instead of "Completed"
        if (isQuoteFile) {
          statusText = "Viewed";
          statusClass = "track-completed"; // Keep green color
        } else {
          statusText = "Completed";
          statusClass = "track-completed";
          completedCount++; // Only increment progress for actual lessons
        }
      }

      const badge = document.createElement("span");
      badge.className = `track-status-badge ${statusClass}`;
      badge.textContent = statusText;
      fileLink.appendChild(badge);
    });

    // Remove existing hardcoded badges/progress to avoid duplicates
    const oldBadges = document.querySelectorAll(
      ".completed-badge, .active-badge, .progress-wrap",
    );
    oldBadges.forEach((el) => el.remove());

    // Inject New Progress Bar
    if (trackableFilesCount > 0) {
      const pct = Math.round((completedCount / trackableFilesCount) * 100);
      const pageHeader = document.querySelector(".page-header");
      if (pageHeader) {
        const progContainer = document.createElement("div");
        progContainer.className = "course-progress-container";
        progContainer.innerHTML = `
          <div class="course-progress-header">
            <span>Course Progress</span>
            <span>${completedCount} / ${trackableFilesCount} (${pct}%)</span>
          </div>
          <div class="course-progress-bar">
            <div class="course-progress-fill" style="width: ${pct}%"></div>
          </div>
        `;
        pageHeader.appendChild(progContainer);
      }
    }
  }

  if (isLessonPage) {
    // Construct the file key based on the URL so it matches the hub page href
    const pathParts = window.location.pathname.split("/");
    const filename = decodeURIComponent(pathParts.pop());
    const foldername = decodeURIComponent(pathParts.pop());
    const fileKey = foldername + "/" + filename;

    // Mark as in-progress if not already completed
    if (progressData[fileKey] !== "completed") {
      progressData[fileKey] = "in-progress";
      localStorage.setItem("learningProgress", JSON.stringify(progressData));
    }

    // Inject Mark Complete Button
    const pageNav = document.querySelector(".page-nav");
    if (pageNav) {
      const btnContainer = document.createElement("div");
      const markBtn = document.createElement("button");
      markBtn.className = "mark-complete-btn";
      
      const isQuoteFile = window.location.pathname.toLowerCase().includes("quote");
      const completedText = isQuoteFile ? "&#10004; Viewed" : "&#10004; Completed";
      const actionText = isQuoteFile ? "Mark as Viewed" : "Mark as Complete";

      if (progressData[fileKey] === "completed") {
        markBtn.classList.add("is-completed");
        markBtn.innerHTML = completedText;
      } else {
        markBtn.innerHTML = actionText;
        markBtn.addEventListener("click", () => {
          progressData[fileKey] = "completed";
          localStorage.setItem(
            "learningProgress",
            JSON.stringify(progressData),
          );
          markBtn.classList.add("is-completed");
          markBtn.innerHTML = completedText;
        });
      }

      btnContainer.appendChild(markBtn);
      pageNav.parentNode.insertBefore(btnContainer, pageNav);
    }
  }

  if (isIntroPage) {
    const updateIntroProgress = (url, countId, totalId, pctId, barId) => {
      fetch(url)
        .then(r => r.text())
        .then(html => {
          const doc = new DOMParser().parseFromString(html, "text/html");
          const links = doc.querySelectorAll(".tree-file");
          let total = 0;
          let completed = 0;
          links.forEach(link => {
            const href = link.getAttribute("href");
            if (!href || href.startsWith("http") || href.toLowerCase().includes("quote")) return;
            total++;
            const fileKey = decodeURIComponent(href);
            if (progressData[fileKey] === "completed") {
              completed++;
            }
          });
          const pct = total === 0 ? 0 : Math.round((completed / total) * 100);
          
          const countEl = document.getElementById(countId);
          const totalEl = document.getElementById(totalId);
          const pctEl = document.getElementById(pctId);
          const barEl = document.getElementById(barId);
          
          if (countEl) countEl.textContent = completed;
          if (totalEl) totalEl.textContent = total;
          if (pctEl) pctEl.textContent = pct + "%";
          if (barEl) setTimeout(() => barEl.style.width = pct + "%", 300);
        })
        .catch(err => console.error("Failed to fetch course data", err));
    };

    updateIntroProgress("kali.html", "m1-count", "m1-total", "m1-pct", "m1-bar");
    updateIntroProgress("networking.html", "m2-count", "m2-total", "m2-pct", "m2-bar");
  }
});
