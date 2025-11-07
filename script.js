(() => {
  // Theme toggle: cycle through light -> dark -> neo
  const btn = document.getElementById("themeToggle");
  const themes = ["theme-light", "theme-dark", "theme-neo"];
  let current = 0;

  function applyTheme(idx) {
    document.body.classList.remove(...themes);
    document.body.classList.add(themes[idx]);
    // update button icon
    btn.textContent = idx === 0 ? "🌗" : idx === 1 ? "🌙" : "✨";
    // store
    try {
      localStorage.setItem("site-theme", String(idx));
    } catch (e) {}
  }

  // Load saved theme
  try {
    const saved = localStorage.getItem("site-theme");
    if (saved !== null) current = Math.min(Math.max(parseInt(saved, 10), 0), 2);
  } catch (e) {}
  applyTheme(current);

  btn.addEventListener("click", () => {
    current = (current + 1) % themes.length;
    applyTheme(current);
  });

  // Projects lightbox logic
  const images = Array.from(document.querySelectorAll(".project-media img"));
  const lightbox = document.getElementById("lightbox");
  const lbImage = document.getElementById("lbImage");
  const lbCaption = document.getElementById("lbCaption");
  const closeBtn = document.querySelector(".lb-close");
  const prevBtn = document.querySelector(".lb-prev");
  const nextBtn = document.querySelector(".lb-next");

  let activeIndex = 0;
  const projectData = images.map((img, idx) => ({
    src: img.src,
    alt: img.alt || `Project image ${idx + 1}`,
    desc:
      img.closest(".project-card").querySelector(".proj-desc")?.textContent ||
      "",
  }));

  function openLightbox(index) {
    activeIndex = index;
    const data = projectData[activeIndex];
    lbImage.src = data.src;
    lbImage.alt = data.alt;
    lbCaption.textContent = data.desc;
    lightbox.classList.add("show");
    lightbox.setAttribute("aria-hidden", "false");
    // trap focus for accessibility
    closeBtn.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove("show");
    lightbox.setAttribute("aria-hidden", "true");
    lbImage.src = "";
  }

  function showNext(delta = 1) {
    activeIndex =
      (activeIndex + delta + projectData.length) % projectData.length;
    openLightbox(activeIndex);
  }

  // click handlers to open
  document.querySelectorAll(".view-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const idx = Number(btn.dataset.index);
      openLightbox(idx);
    });
  });

  images.forEach((img) => {
    img.addEventListener("click", () =>
      openLightbox(Number(img.dataset.index))
    );
  });

  // controls
  closeBtn.addEventListener("click", closeLightbox);
  prevBtn.addEventListener("click", () => showNext(-1));
  nextBtn.addEventListener("click", () => showNext(1));

  window.addEventListener("keydown", (e) => {
    if (lightbox.classList.contains("show")) {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") showNext(1);
      if (e.key === "ArrowLeft") showNext(-1);
    }
  });

  // clicking outside image closes
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Contact form handling (front-end only)
  const form = document.getElementById("contactForm");
  const formMsg = document.getElementById("formMsg");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    formMsg.textContent = "";
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    // basic validation
    if (!name || !email || !message) {
      formMsg.textContent = "Please fill all fields.";
      return;
    }
    // simple email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      formMsg.textContent = "Please enter a valid email address.";
      return;
    }

    // For this static template we simulate sending
    formMsg.textContent = "Sending message...";
    // Simulate network delay
    setTimeout(() => {
      formMsg.textContent =
        "Thanks — your message was sent (demo). I will respond to " +
        email +
        " soon.";
      form.reset();
    }, 700);
  });

  // Footer year auto set
  document.getElementById("year").textContent = new Date().getFullYear();
})();
