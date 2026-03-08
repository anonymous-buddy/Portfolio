(function () {
  // Config
  const MIN_LOAD_TIME = 2200;
  // Determine section name from URL path to keep it "Once per Section"
  const path = window.location.pathname.toLowerCase();
  let section = "portfolio";
  if (path.includes("/store/")) section = "store";
  else if (path.includes("/certifications/")) section = "certifications";
  else if (path.includes("/learning/")) section = "learning";

  const sessionKey = `bootCompleted_${section}`;

  let isWindowLoaded = false;
  window.addEventListener("load", () => {
    isWindowLoaded = true;
  });

  function completeImmediate() {
    const loader = document.getElementById("loader-container");
    if (loader) loader.style.display = "none";
    if (typeof window.initializeApp === "function") window.initializeApp();
    if (typeof window.initChatHint === "function") window.initChatHint();
    document.body.classList.remove("preload");
    document.documentElement.classList.remove("preload");
  }

  function startSequence() {
    if (sessionStorage.getItem(sessionKey)) {
      completeImmediate();
      return;
    }

    const loaderPercent = document.getElementById("loader-percent");
    const loaderStatus = document.getElementById("loader-status");
    const loaderProgress = document.getElementById("loader-progress");
    const loaderContainer = document.getElementById("loader-container");

    // Telemetry HUDs
    const hudMem = document.getElementById("hud-mem");
    const hudData = document.getElementById("hud-data");
    const hudSec = document.getElementById("hud-sec");
    const hudNet = document.getElementById("hud-net");
    const statusContainer = document.getElementById("aegis-status-container");

    if (!loaderContainer) {
      setTimeout(startSequence, 50);
      return;
    }

    const stages = [
      "INITIALIZING SYSTEM",
      "SCANNING NETWORKS",
      "DECRYPTING STREAMS",
      "ACCESS GRANTED",
    ];

    let currentProgress = 0;
    let targetProgress = 12; // Start burst
    let currentStage = 0;

    // Telemetry generator
    const memInterval = setInterval(() => {
      if (hudMem && currentProgress < 100) {
        hudMem.textContent =
          "0x" +
          Math.floor(Math.random() * 65535)
            .toString(16)
            .toUpperCase()
            .padStart(4, "0");
      }
      if (hudData && currentProgress < 100) {
        hudData.textContent = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.X.X`;
      }
    }, 100);

    function updateStages(progress) {
      const newStage = Math.floor(progress / 26);
      if (newStage !== currentStage && newStage < 4) {
        currentStage = newStage;

        if (loaderStatus) {
          loaderStatus.classList.add("glitching");
          setTimeout(() => {
            if (!loaderStatus) return;
            loaderStatus.textContent = stages[currentStage];
            loaderStatus.setAttribute("data-text", stages[currentStage]);
            loaderStatus.classList.remove("glitching");

            if (currentStage === 3) {
              if (statusContainer)
                statusContainer.classList.add("aegis-success");
              if (hudSec) hudSec.textContent = "VERIFIED";
              if (hudNet) hudNet.textContent = "CONNECTED";
            } else if (currentStage === 2) {
              if (hudSec) hudSec.textContent = "DECRYPTING...";
            } else if (currentStage === 1) {
              if (hudNet) hudNet.textContent = "UPLINK EST";
            }
          }, 300);
        }

        for (let i = 0; i <= 3; i++) {
          const dot = document.getElementById("stage-" + i);
          if (!dot) continue;
          if (i < currentStage) {
            dot.className = "aegis-dot completed";
          } else if (i === currentStage) {
            dot.className = "aegis-dot active";
          } else {
            dot.className = "aegis-dot";
          }
        }
      }
    }

    const startTime = Date.now();

    function updateLoader() {
      const elapsed = Date.now() - startTime;

      if (isWindowLoaded) {
        if (elapsed > MIN_LOAD_TIME) {
          targetProgress = 100;
        } else {
          targetProgress = Math.max(
            targetProgress,
            (elapsed / MIN_LOAD_TIME) * 100,
          );
        }
      } else {
        targetProgress += (88 - targetProgress) * 0.01;
      }

      currentProgress += (targetProgress - currentProgress) * 0.08;
      if (currentProgress > 99.9) currentProgress = 100;

      if (loaderProgress) loaderProgress.style.width = currentProgress + "%";
      if (loaderPercent)
        loaderPercent.textContent = Math.floor(currentProgress);

      updateStages(currentProgress);

      if (currentProgress >= 100) {
        clearInterval(memInterval);
        if (hudMem) hudMem.textContent = "0xFFFF";
        if (hudData) hudData.textContent = "OK";
        setTimeout(finishBoot, 500);
        return;
      }

      requestAnimationFrame(updateLoader);
    }

    requestAnimationFrame(updateLoader);
  }

  function finishBoot() {
    const loader = document.getElementById("loader-container");
    const core = document.getElementById("aegis-core");
    const statusContainer = document.getElementById("aegis-status-container");

    if (core) core.classList.add("iris-open");
    if (statusContainer) statusContainer.classList.add("hidden");

    if (loader) {
      setTimeout(() => {
        loader.classList.add("hidden");
      }, 400);
    }

    sessionStorage.setItem(sessionKey, "true");

    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);

    setTimeout(() => {
      if (loader) loader.style.display = "none";
      if (typeof window.initializeApp === "function") window.initializeApp();
      if (typeof window.initChatHint === "function") window.initChatHint();
      document.body.classList.remove("preload");
      document.documentElement.classList.remove("preload");
    }, 1100);
  }

  // Initialize immediately
  startSequence();
})();
