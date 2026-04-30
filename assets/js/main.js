/**
 * Daily News BD — main.js
 * Covers: ticker, sliders, back-to-top, sticky nav, search toggle
 * Vanilla JS only — no heavy libraries.
 */

(function () {
  "use strict";

  /* ============================================================
     1. BREAKING NEWS TICKER — duplicate content for seamless loop
  ============================================================ */
  function initTicker() {
    const track = document.getElementById("tickerTrack");
    if (!track) return;

    // ticker speed set
    track.style.animationDuration = "10s";

    // Clone items so the loop is seamless
    const original = track.innerHTML;
    track.innerHTML = original + original;

    // Pause on hover (CSS handles it but we also cover touch)
    track.addEventListener("mouseenter", () => {
      track.style.animationPlayState = "paused";
    });
    track.addEventListener("mouseleave", () => {
      track.style.animationPlayState = "running";
    });
  }

  /* ============================================================
     2. GENERIC SLIDER FACTORY
     Moves cards inside .exclusive-track by sliding one card width
  ============================================================ */
  function initSlider(prevBtnId, nextBtnId, trackId) {
    const prevBtn = document.getElementById(prevBtnId);
    const nextBtn = document.getElementById(nextBtnId);
    const track = document.getElementById(trackId);
    if (!prevBtn || !nextBtn || !track) return;

    let currentIndex = 0;

    function getVisibleCount() {
      const trackWidth = track.offsetWidth;
      const cards = track.querySelectorAll(".excl-card");
      if (!cards.length) return 1;
      const cardWidth =
        cards[0].offsetWidth + parseInt(getComputedStyle(track).gap || 12);
      return Math.max(1, Math.floor(trackWidth / cardWidth));
    }

    function getMaxIndex() {
      const cards = track.querySelectorAll(".excl-card");
      return Math.max(0, cards.length - getVisibleCount());
    }

    function updateSlider() {
      const cards = track.querySelectorAll(".excl-card");
      if (!cards.length) return;
      const cardWidth =
        cards[0].offsetWidth + parseInt(getComputedStyle(track).gap || 12);
      track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
      track.style.transition = "transform 0.35s ease";

      prevBtn.disabled = currentIndex <= 0;
      nextBtn.disabled = currentIndex >= getMaxIndex();
      prevBtn.style.opacity = currentIndex <= 0 ? "0.45" : "1";
      nextBtn.style.opacity = currentIndex >= getMaxIndex() ? "0.45" : "1";
    }

    // Ensure track has overflow:hidden and no flex-wrap
    track.style.overflow = "hidden";
    track.style.flexWrap = "nowrap";

    nextBtn.addEventListener("click", () => {
      if (currentIndex < getMaxIndex()) {
        currentIndex++;
        updateSlider();
      }
    });

    prevBtn.addEventListener("click", () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateSlider();
      }
    });

    // Reset on resize
    window.addEventListener("resize", () => {
      if (currentIndex > getMaxIndex()) {
        currentIndex = getMaxIndex();
      }
      updateSlider();
    });

    // Touch swipe support
    let touchStartX = 0;
    track.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].clientX;
      },
      { passive: true },
    );
    track.addEventListener(
      "touchend",
      (e) => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) {
          if (diff > 0) nextBtn.click();
          else prevBtn.click();
        }
      },
      { passive: true },
    );

    updateSlider();
  }

  /* ============================================================
     3. BACK TO TOP BUTTON
  ============================================================ */
  function initBackToTop() {
    const btn = document.getElementById("backToTop");
    if (!btn) return;

    function toggleVisibility() {
      if (window.scrollY > 400) {
        btn.classList.add("visible");
      } else {
        btn.classList.remove("visible");
      }
    }

    window.addEventListener("scroll", toggleVisibility, { passive: true });

    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ============================================================
     4. STICKY NAVBAR — add shadow class on scroll
  ============================================================ */
  function initStickyNav() {
    const header = document.getElementById("main-header");
    if (!header) return;

    window.addEventListener(
      "scroll",
      () => {
        if (window.scrollY > 10) {
          header.classList.add("scrolled");
        } else {
          header.classList.remove("scrolled");
        }
      },
      { passive: true },
    );
  }

  /* ============================================================
     5. DATE/TIME IN TOPBAR (optional enhancement)
     Injects Bangla date into .topbar if element exists
  ============================================================ */
  function initDateTime() {
    const el = document.getElementById("topbarDatetime");
    if (!el) return;

    const bnDays = [
      "রবিবার",
      "সোমবার",
      "মঙ্গলবার",
      "বুধবার",
      "বৃহস্পতিবার",
      "শুক্রবার",
      "শনিবার",
    ];
    const bnMonths = [
      "জানুয়ারি",
      "ফেব্রুয়ারি",
      "মার্চ",
      "এপ্রিল",
      "মে",
      "জুন",
      "জুলাই",
      "আগস্ট",
      "সেপ্টেম্বর",
      "অক্টোবর",
      "নভেম্বর",
      "ডিসেম্বর",
    ];

    function toBengaliNum(n) {
      const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
      return String(n).replace(/\d/g, (d) => bnDigits[d]);
    }

    function update() {
      const now = new Date();
      const day = bnDays[now.getDay()];
      const date = toBengaliNum(now.getDate());
      const month = bnMonths[now.getMonth()];
      const year = toBengaliNum(now.getFullYear());
      let h = now.getHours();
      const m = String(now.getMinutes()).padStart(2, "0");
      const ampm = h >= 12 ? "PM" : "AM";
      h = h % 12 || 12;
      el.textContent = `${day}, ${date} ${month} ${year} | ${toBengaliNum(h)}:${toBengaliNum(m)} ${ampm}`;
    }

    update();
    setInterval(update, 30000);
  }

  /* ============================================================
     6. SEARCH INPUT — ESC to clear
  ============================================================ */
  function initSearch() {
    const inputs = document.querySelectorAll(".nav-search-input");
    inputs.forEach((input) => {
      input.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          input.value = "";
          input.blur();
        }
      });
    });
  }

  /* ============================================================
     7. LAZY LOAD IMAGES — IntersectionObserver polite reveal
  ============================================================ */
  function initLazyReveal() {
    if (!("IntersectionObserver" in window)) return;

    const imgs = document.querySelectorAll('img[loading="lazy"]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );

    imgs.forEach((img) => {
      img.style.opacity = "0";
      img.style.transition = "opacity 0.4s ease";
      img.addEventListener("load", () => {
        img.style.opacity = "1";
      });
      if (img.complete) {
        img.style.opacity = "1";
      } else {
        observer.observe(img);
      }
    });
  }

  /* ============================================================
     8. ACTIVE NAV LINK — highlight current page link
  ============================================================ */
  function initActiveNav() {
    const currentPage =
      window.location.pathname.split("/").pop() || "index.html";
    const links = document.querySelectorAll(".main-nav-links .nav-link");
    links.forEach((link) => {
      const href = link.getAttribute("href") || "";
      if (
        href === currentPage ||
        (currentPage === "" && href === "index.html")
      ) {
        link.classList.add("active");
      }
    });
  }

  /* ============================================================
     INIT ALL
  ============================================================ */
  document.addEventListener("DOMContentLoaded", () => {
    initTicker();
    initSlider("exclPrev", "exclNext", "exclusiveTrack");
    initSlider("travelPrev", "travelNext", "travelTrack");
    initBackToTop();
    initStickyNav();
    initDateTime();
    initSearch();
    initLazyReveal();
    initActiveNav();

    /* ── SORT BUTTONS (visual toggle only — no real filtering) ─── */
    function initCatSortBtns() {
      const btns = document.querySelectorAll(".cat-sort-btn");
      if (!btns.length) return;

      btns.forEach((btn) => {
        btn.addEventListener("click", () => {
          btns.forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");

          // Visual feedback: briefly fade grid then restore
          const grid = document.getElementById("catNewsGrid");
          if (grid) {
            grid.style.opacity = "0.4";
            grid.style.transition = "opacity 0.25s ease";
            setTimeout(() => {
              grid.style.opacity = "1";
            }, 300);
          }
        });
      });
    }

    /* ── CATEGORY PAGE PAGINATION ──────────────────────────────── */
    function initCatPagination() {
      const pageLinks = document.querySelectorAll('.cat-page-link[href="#"]');
      if (!pageLinks.length) return;

      pageLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
          e.preventDefault();

          // Update active state
          document.querySelectorAll(".cat-page-item").forEach((item) => {
            item.classList.remove("active");
          });
          link.closest(".cat-page-item")?.classList.add("active");

          // Scroll to top of news grid
          const grid = document.getElementById("cat-news-grid");
          if (grid) {
            grid.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        });
      });
    }
    initCatSortBtns();
    initCatPagination();
  });
})();
