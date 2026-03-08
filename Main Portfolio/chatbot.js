const chatBot = document.getElementById("chatbot");
const openChat = document.getElementById("open-chat");
const closeChat = document.getElementById("chat-toggle");
const chatBody = document.getElementById("chat-body");
const chatInput = document.getElementById("chat-input");

// ─── Contact flow state ────────────────────────────────────────────────────
const contactFlow = {
  active: false,
  step: null, // 'name' | 'email' | 'message' | 'sending'
  name: "",
  email: "",
  message: "",
};

function resetContactFlow() {
  contactFlow.active = false;
  contactFlow.step = null;
  contactFlow.name = "";
  contactFlow.email = "";
  contactFlow.message = "";
}
// ──────────────────────────────────────────────────────────────────────────

const responses = {
  about: [
    "👋 ABOUT USMAN",
    "",
    "He is an aspiring cybersecurity professional and developer.",
    "He explores systems, code, and security together.",
    "",
    "🔐 Understanding weaknesses is how defense is built.",
  ],

  skills: [
    "🧠 SKILLS",
    "",
    "🐍 Python — hacking, networking, web security (60%)",
    "🌐 JavaScript — secure frontend logic (80%)",
    "☕ Java — OOP fundamentals (10%)",
    "🛡️ Web Security — XSS, validation (50%)",
    "🦠 Malware Analysis — behavioral analysis (45%)",
    "⚙️ C & Assembly — low-level basics (35%)",
  ],

  projects: [
    "📂 PROJECTS",
    "",
    "🔐 Caesar Cipher — Python cryptography",
    "🎮 Java Tic Tac Toe — secure OOP design",
    "🧪 JS Form Validator — input sanitization",
    "📘 Notes — Daily Learning Notes in an organized HTML format",
  ],

  learning: [
    "🛤️ LEARNING PATH",
    "",
    "📘 Foundations — Python, Linux, Networking",
    "🌐 Web Security — SQLi, XSS, CSRF",
    "🦠 Malware Analysis — reverse engineering",
    "🚩 Advanced Security — pentesting & exploits",
  ],

  default: [
    "🤖 I'm Sentinel.",
    "",
    "Ask me about Usman's:",
    "• bio",
    "• skills",
    "• projects",
    "• learning path",
    "• contact",
    "• quotes",
  ],
};

let quotes = [
  " 'CTFs sharpen the knife. Real hacking decides where to cut.'",
  " 'Hackers don't guess. They observe.'",
  " 'Every login is a trust decision.'",
  " 'Most hacks are old mistakes, repeated.'",
  " 'Discipline is choosing future pride over present comfort.'",
  " 'Consistency beats intensity. Always.'",
  " 'Momentum is not perfection. It's recovery speed.'",
  " 'Starting is the real battle.'",
];

// ─── Core UI helpers ───────────────────────────────────────────────────────
function formatText(lines) {
  return lines.join("\n");
}

function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = `message ${type}`;
  div.textContent = text;
  chatBody.appendChild(div);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function clearOldButtons() {
  const old = chatBody.querySelector(".chat-buttons");
  if (old) old.remove();
}

function addButtons(
  commands = [
    "about",
    "skills",
    "projects",
    "learning path",
    "contact",
    "quote",
  ],
) {
  clearOldButtons();
  const container = document.createElement("div");
  container.className = "chat-buttons";
  commands.forEach((cmd) => {
    const btn = document.createElement("button");
    btn.className = "chat-btn";
    btn.textContent = cmd;
    btn.onclick = () => handleUserInput(cmd);
    container.appendChild(btn);
  });
  chatBody.appendChild(container);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function botReply(text, showButtons = true) {
  const thinking = document.createElement("div");
  thinking.className = "message bot";
  thinking.textContent = "Sentinel is thinking";
  chatBody.appendChild(thinking);

  let dots = 0;
  const dotAnim = setInterval(() => {
    dots = (dots + 1) % 4;
    thinking.textContent = "Sentinel is thinking" + ".".repeat(dots);
  }, 400);

  setTimeout(() => {
    clearInterval(dotAnim);
    chatBody.removeChild(thinking);
    typeText(text, showButtons);
  }, 900);
}

function typeText(text, showButtons = true) {
  const div = document.createElement("div");
  div.className = "message bot";
  div.style.whiteSpace = "pre-line";
  chatBody.appendChild(div);

  let i = 0;
  const typer = setInterval(() => {
    div.textContent += text[i++];
    chatBody.scrollTop = chatBody.scrollHeight;
    if (i >= text.length) {
      clearInterval(typer);
      if (showButtons) addButtons();
    }
  }, 18);
}
// ──────────────────────────────────────────────────────────────────────────

// ─── Contact flow ──────────────────────────────────────────────────────────
function startContactFlow() {
  resetContactFlow();
  contactFlow.active = true;
  contactFlow.step = "name";
  clearOldButtons();
  botReply(
    "📝 Let's send Usman a message!\n\nFirst — what's your name?",
    false,
  );
}

function handleContactStep(input) {
  const val = input.trim();
  if (!val) return;

  if (contactFlow.step === "name") {
    addMessage(val, "user");
    if (val.length < 2) {
      botReply(
        "That name seems too short. Please enter your full name.",
        false,
      );
      return;
    }
    contactFlow.name = val;
    contactFlow.step = "email";
    botReply(
      `Nice to meet you, ${val}! 👋\n\nWhat's your email address so Usman can reply?`,
      false,
    );
  } else if (contactFlow.step === "email") {
    addMessage(val, "user");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      botReply(
        "That doesn't look like a valid email. Please try again.",
        false,
      );
      return;
    }
    contactFlow.email = val;
    contactFlow.step = "message";
    botReply(
      "Perfect! ✅\n\nNow type your message — what would you like to tell Usman?",
      false,
    );
  } else if (contactFlow.step === "message") {
    addMessage(val, "user");
    if (val.length < 5) {
      botReply(
        "Message seems too short. Please write at least a sentence.",
        false,
      );
      return;
    }
    contactFlow.message = val;
    contactFlow.step = "sending";
    sendContactMessage();
  }
}

function sendContactMessage() {
  // Animated sending indicator
  const sendingDiv = document.createElement("div");
  sendingDiv.className = "message bot";
  sendingDiv.textContent = "📡 Sending your message";
  chatBody.appendChild(sendingDiv);
  chatBody.scrollTop = chatBody.scrollHeight;

  let dots = 0;
  const dotAnim = setInterval(() => {
    dots = (dots + 1) % 4;
    sendingDiv.textContent = "📡 Sending your message" + ".".repeat(dots);
  }, 400);

  const { name, email, message } = contactFlow;
  const time = new Date().toLocaleString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  function finish(success) {
    clearInterval(dotAnim);
    chatBody.removeChild(sendingDiv);
    resetContactFlow();

    if (success) {
      typeText(
        `✅ Message sent!\n\nUsman received your message, ${name}. ` +
          "He personally reads and replies to every message — usually within 24–48 hours. 🚀\n\n" +
          "Check your inbox for a confirmation email!",
        true,
      );
    } else {
      typeText(
        "❌ Message failed to send — possibly a network issue.\n\n" +
          "You can reach Usman directly:\n" +
          "✉️  70-1-4-4-10-70@proton.me\n" +
          "📱  WhatsApp: +92 336 1004639",
        true,
      );
    }
  }

  function trySend() {
    if (typeof emailjs === "undefined") {
      setTimeout(trySend, 200);
      return;
    }

    // Send the main notification to Usman first
    emailjs
      .send("service_ou9wrhm", "template_klpi1oq", {
        from_name: name,
        from_email: email,
        message,
        time,
      })
      .then(() => {
        // Main email succeeded, notify user of success immediately
        finish(true);

        // Try sending auto-reply silently in background
        emailjs
          .send("service_ou9wrhm", "template_emj3218", {
            to_name: name,
            name,
            from_email: email,
            to_email: email,
            email,
            message,
            time,
          })
          .catch((err) =>
            console.warn("Auto-reply failed, but main message sent:", err),
          );
      })
      .catch((err) => {
        console.error("Main contact email failed:", err);
        finish(false);
      });
  }

  trySend();
}
// ──────────────────────────────────────────────────────────────────────────

// ─── Input router ──────────────────────────────────────────────────────────
function handleUserInput(input) {
  // Route to contact flow if active
  if (contactFlow.active && contactFlow.step !== "sending") {
    handleContactStep(input);
    chatInput.value = "";
    return;
  }

  addMessage(input, "user");
  const msg = input.toLowerCase().trim();

  if (msg === "about" || msg === "bio") botReply(formatText(responses.about));
  else if (msg === "skills") botReply(formatText(responses.skills));
  else if (msg === "projects") botReply(formatText(responses.projects));
  else if (msg.includes("learning")) botReply(formatText(responses.learning));
  else if (msg === "contact") {
    clearOldButtons();
    startContactFlow();
  } else if (msg.includes("quote")) {
    if (quotes.length === 0) botReply("⚠️ No more quotes until refresh.");
    else {
      const i = Math.floor(Math.random() * quotes.length);
      botReply("💬 " + quotes.splice(i, 1)[0]);
    }
  } else botReply(formatText(responses.default));
}
// ──────────────────────────────────────────────────────────────────────────

// ─── Chat hint (removed) ───────────────────────────────────────────────────
function initChatHint() {
  /* No op since we use global red dot now */
}
window.initChatHint = initChatHint;
// ──────────────────────────────────────────────────────────────────────────

// ─── Open / Close ──────────────────────────────────────────────────────────
openChat.onclick = () => {
  openChat.classList.add("chatted");

  chatBody.innerHTML = "";
  chatInput.value = "";
  resetContactFlow();

  chatBot.classList.add("show");
  openChat.style.display = "none";
  document.body.classList.add("chat-active");
  document.documentElement.classList.add("chat-active");

  botReply(formatText(responses.default));
};

closeChat.onclick = () => {
  chatBot.classList.remove("show");
  resetContactFlow();
  document.body.classList.remove("chat-active");
  document.documentElement.classList.remove("chat-active");
  setTimeout(() => {
    openChat.style.display = "flex";
  }, 400);
};

chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && chatInput.value.trim()) {
    handleUserInput(chatInput.value.trim());
    chatInput.value = "";
  }
});
// ──────────────────────────────────────────────────────────────────────────
