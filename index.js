"use strict";

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const root = document.documentElement;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const projectData = {
  "azure-platform": {
    eyebrow: "Cloud infrastructure · Private client work",
    title: "Multi-Environment Azure Infrastructure Platform",
    summary:
      "A reusable Azure platform designed to support development, demo, production, and client-specific environments with consistent naming, security, and deployment practices.",
    challenge:
      "Modernize and standardize a growing Azure footprint across subscriptions without relying on fragile manual deployments.",
    solution:
      "Built subscription-scoped Bicep orchestration, resource-group modules, parameterized environments, and Azure DevOps pipelines with validation and controlled deployment stages.",
    impact:
      "Created repeatable deployments, clearer environment separation, stronger access patterns, and faster troubleshooting across a complex cloud stack.",
    tech: [
      "Microsoft Azure",
      "Bicep",
      "Azure DevOps",
      "App Service",
      "Key Vault",
      "App Configuration",
      "SQL Managed Instance",
      "Container Apps",
      "VNet",
      "RBAC"
    ],
    actions: [{ label: "Discuss similar work", href: "#contact" }]
  },

  "static-web-apps": {
    eyebrow: "Cloud delivery · CI/CD",
    title: "Multi-Target Static Web App Deployment",
    summary:
      "A streamlined Azure DevOps workflow that builds a frontend once and publishes it to multiple Static Web App targets across separate environments.",
    challenge:
      "Keep multiple frontend destinations aligned while avoiding duplicate builds and inconsistent releases.",
    solution:
      "Created a parameterized YAML pipeline using Node, environment-specific build commands, and multiple deployment tasks with separate credentials.",
    impact:
      "Reduced duplicate work, improved release consistency, and created a cleaner path for development and production deployments.",
    tech: [
      "Azure Static Web Apps",
      "Azure DevOps",
      "YAML",
      "Node.js",
      "Angular",
      "CI/CD"
    ],
    actions: [{ label: "Ask about this project", href: "#contact" }]
  },

  "accounting-site": {
    eyebrow: "Client website · Business",
    title: "Awesome Accounting Website",
    summary:
      "A professional accounting website designed and maintained to improve credibility, explain services clearly, and make it easier for prospective clients to connect with the firm.",
    challenge:
      "Create a polished, responsive presence and make contact forms work reliably on production hosting.",
    solution:
      "Built responsive pages, navigation, branded sections, content workflows, and PHP email handling while troubleshooting hosting and form-delivery issues.",
    impact:
      "Delivered a stronger online presence, clearer client communication, mobile-friendly pages, and a dependable inquiry workflow.",
    tech: [
      "HTML5",
      "CSS3",
      "JavaScript",
      "PHP",
      "PHPMailer",
      "Responsive Design",
      "CMS Workflows"
    ],
    actions: [
      {
        label: "Visit live website",
        href: "https://www.awesomeaccountinginc.com",
        external: true
      },
      {
        label: "Request a website",
        href: "#contact"
      }
    ]
  },

  "accounting-assistant": {
    eyebrow: "AI automation · Full stack",
    title: "AI Accounting Assistant",
    summary:
      "A local application that turns raw CSV transaction data into a reviewable workflow with categorization, editing, deletion, and persistence.",
    challenge:
      "Make transaction review more practical than manually cleaning and categorizing rows in spreadsheets.",
    solution:
      "Connected a FastAPI backend to a React and TypeScript interface with CSV parsing, transaction actions, user feedback, and persistent storage.",
    impact:
      "Created a working foundation for faster transaction review and future AI-assisted bookkeeping workflows.",
    tech: [
      "FastAPI",
      "Python",
      "React",
      "TypeScript",
      "Vite",
      "CSV Processing",
      "REST API"
    ],
    actions: [{ label: "Discuss an automation", href: "#contact" }]
  },

  "receipt-categorizer": {
    eyebrow: "Document automation · Python",
    title: "AI Receipt Categorizer",
    summary:
      "An AI-first receipt processing tool that reads images and PDFs, extracts structured financial fields, categorizes expenses, and exports results to CSV.",
    challenge:
      "Process a mixed folder of receipt files while avoiding unreliable vendor detection and excessive manual review.",
    solution:
      "Used vision-capable AI extraction, PyMuPDF for PDF handling, a defined accounting category system, and confidence-based review logic.",
    impact:
      "Turned unstructured receipt files into organized accounting data and reduced repetitive entry work.",
    tech: [
      "Python",
      "OpenAI API",
      "PyMuPDF",
      "Structured Data",
      "CSV",
      "Prompt Design"
    ],
    actions: [{ label: "Build a similar workflow", href: "#contact" }]
  },

  reconciliation: {
    eyebrow: "Financial systems · Operations",
    title: "Sales and Payout Reconciliation Systems",
    summary:
      "Structured workflows for comparing sales platforms, bank deposits, refunds, processing fees, and timing differences in a clearer and repeatable way.",
    challenge:
      "Reconcile transactions across different systems where payout timing and fee treatment did not line up cleanly.",
    solution:
      "Organized source data, standardized categories, built formulas and review logic, and documented the reconciliation process.",
    impact:
      "Improved visibility into discrepancies and made recurring financial review more consistent.",
    tech: [
      "Microsoft Excel",
      "Accounting",
      "Data Cleaning",
      "Reconciliation",
      "Shopify",
      "Process Documentation"
    ],
    actions: [{ label: "Discuss a business system", href: "#contact" }]
  }
};

function showToast(message) {
  const toast = $("#toast");

  if (!toast) {
    return;
  }

  toast.textContent = message;
  toast.classList.add("show");

  window.clearTimeout(showToast.timeoutId);

  showToast.timeoutId = window.setTimeout(() => {
    toast.classList.remove("show");
  }, 2400);
}

function setTheme(theme) {
  root.dataset.theme = theme;

  try {
    localStorage.setItem("portfolio-theme", theme);
  } catch {
    // The website still works when storage is blocked.
  }

  const color = theme === "dark" ? "#070b16" : "#f4f7fc";

  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", color);
}

function initTheme() {
  let saved = null;

  try {
    saved = localStorage.getItem("portfolio-theme");
  } catch {
    saved = null;
  }

  const preferred = window.matchMedia("(prefers-color-scheme: light)")
    .matches
    ? "light"
    : "dark";

  setTheme(saved || preferred);

  $("#themeToggle")?.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  });
}

function initHeader() {
  const header = $("#siteHeader");
  const progress = $("#scrollProgress");
  const navToggle = $("#navToggle");
  const navLinks = $("#navLinks");
  const sections = $$("main section[id]");
  const links = $$(".nav-links a");

  const closeNavigation = () => {
    navLinks?.classList.remove("open");
    navToggle?.setAttribute("aria-expanded", "false");

    if (navToggle) {
      navToggle.innerHTML =
        '<svg><use href="#icon-menu"></use></svg>';
    }
  };

  const onScroll = () => {
    header?.classList.toggle("scrolled", window.scrollY > 18);

    const max =
      document.documentElement.scrollHeight - window.innerHeight;

    const percentage =
      max > 0 ? (window.scrollY / max) * 100 : 0;

    if (progress) {
      progress.style.width = `${percentage}%`;
    }

    let activeId = "";

    sections.forEach((section) => {
      if (window.scrollY >= section.offsetTop - 150) {
        activeId = section.id;
      }
    });

    links.forEach((link) => {
      const isActive =
        link.getAttribute("href") === `#${activeId}`;

      link.classList.toggle("active", isActive);
    });
  };

  window.addEventListener("scroll", onScroll, {
    passive: true
  });

  onScroll();

  navToggle?.addEventListener("click", () => {
    const open =
      navLinks?.classList.toggle("open") ?? false;

    navToggle.setAttribute(
      "aria-expanded",
      String(open)
    );

    navToggle.innerHTML = `
      <svg>
        <use href="#icon-${open ? "close" : "menu"}"></use>
      </svg>
    `;
  });

  links.forEach((link) => {
    link.addEventListener("click", closeNavigation);
  });

  document.addEventListener("click", (event) => {
    if (!navLinks?.classList.contains("open")) {
      return;
    }

    if (
      navLinks.contains(event.target) ||
      navToggle?.contains(event.target)
    ) {
      return;
    }

    closeNavigation();
  });
}

function initReveal() {
  const elements = $$(".reveal");

  if (
    reducedMotion ||
    !("IntersectionObserver" in window)
  ) {
    elements.forEach((element) => {
      element.classList.add("visible");
    });

    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.13
    }
  );

  elements.forEach((element, index) => {
    element.style.transitionDelay =
      `${Math.min(index % 4, 3) * 70}ms`;

    observer.observe(element);
  });
}

function initRoleRotator() {
  if (reducedMotion) {
    return;
  }

  const target = $("#rotatingRole");

  if (!target) {
    return;
  }

  const roles = [
    "Cloud Consultant",
    "Network Engineering Student",
    "Web Developer",
    "Automation Builder"
  ];

  let roleIndex = 0;
  let charIndex = roles[0].length;
  let deleting = true;

  const type = () => {
    const role = roles[roleIndex];

    if (deleting) {
      charIndex -= 1;

      target.textContent = role.slice(
        0,
        Math.max(0, charIndex)
      );

      if (charIndex <= 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;

        window.setTimeout(type, 350);
        return;
      }
    } else {
      charIndex += 1;

      target.textContent =
        roles[roleIndex].slice(0, charIndex);

      if (
        charIndex >= roles[roleIndex].length
      ) {
        deleting = true;

        window.setTimeout(type, 1700);
        return;
      }
    }

    window.setTimeout(
      type,
      deleting ? 42 : 72
    );
  };

  window.setTimeout(type, 1700);
}

function initCounters() {
  const counters = $$("[data-count]");

  if (
    reducedMotion ||
    !("IntersectionObserver" in window)
  ) {
    counters.forEach((counter) => {
      counter.textContent =
        counter.dataset.count;
    });

    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const element = entry.target;
        const target = Number(
          element.dataset.count || 0
        );

        const start = performance.now();
        const duration = 900;

        const frame = (now) => {
          const progress = Math.min(
            (now - start) / duration,
            1
          );

          const eased =
            1 - Math.pow(1 - progress, 3);

          element.textContent = String(
            Math.round(target * eased)
          );

          if (progress < 1) {
            requestAnimationFrame(frame);
          }
        };

        requestAnimationFrame(frame);
        observer.unobserve(element);
      });
    },
    {
      threshold: 0.7
    }
  );

  counters.forEach((counter) => {
    observer.observe(counter);
  });
}

function initFilters() {
  const buttons = $$(".filter-button");
  const cards = $$(".project-card[data-category]");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((item) => {
        item.classList.remove("active");
      });

      button.classList.add("active");

      const filter = button.dataset.filter;

      cards.forEach((card) => {
        const categories =
          card.dataset.category.split(" ");

        const show =
          filter === "all" ||
          categories.includes(filter);

        card.classList.toggle(
          "is-hidden",
          !show
        );
      });
    });
  });
}

function initProjectModal() {
  const modal = $("#projectModal");
  const closeButton = $("#modalClose");

  if (!modal) {
    return;
  }

  const populate = (data) => {
    $("#modalEyebrow").textContent =
      data.eyebrow;

    $("#modalTitle").textContent =
      data.title;

    $("#modalSummary").textContent =
      data.summary;

    $("#modalChallenge").textContent =
      data.challenge;

    $("#modalSolution").textContent =
      data.solution;

    $("#modalImpact").textContent =
      data.impact;

    const technologyContainer =
      $("#modalTech");

    technologyContainer.innerHTML =
      data.tech
        .map((item) => `<span>${item}</span>`)
        .join("");

    const actionsContainer =
      $("#modalActions");

    actionsContainer.innerHTML =
      data.actions
        .map((action) => {
          const externalAttributes =
            action.external
              ? ' target="_blank" rel="noopener noreferrer"'
              : "";

          const icon =
            action.external
              ? "external"
              : "arrow";

          return `
            <a href="${action.href}"${externalAttributes}>
              ${action.label}
              <svg>
                <use href="#icon-${icon}"></use>
              </svg>
            </a>
          `;
        })
        .join("");
  };

  $$(".project-open").forEach((button) => {
    button.addEventListener("click", () => {
      const card =
        button.closest("[data-project]");

      const data =
        projectData[card?.dataset.project];

      if (!data) {
        return;
      }

      populate(data);
      modal.showModal();

      document.body.classList.add(
        "modal-open"
      );
    });
  });

  const closeModal = () => {
    modal.close();

    document.body.classList.remove(
      "modal-open"
    );
  };

  closeButton?.addEventListener(
    "click",
    closeModal
  );

  modal.addEventListener("click", (event) => {
    const rect =
      modal.getBoundingClientRect();

    const outside =
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom;

    if (outside) {
      closeModal();
    }
  });

  modal.addEventListener("close", () => {
    document.body.classList.remove(
      "modal-open"
    );
  });

  modal.addEventListener("click", (event) => {
    const anchor =
      event.target.closest('a[href^="#"]');

    if (!anchor) {
      return;
    }

    closeModal();
  });
}

function initExpertiseAccordion() {
  $$(".expertise-toggle").forEach(
    (button) => {
      button.addEventListener("click", () => {
        const panel =
          button.closest(".expertise-panel");

        const wasActive =
          panel.classList.contains("active");

        $$(".expertise-panel").forEach(
          (item) => {
            item.classList.remove("active");

            $(".expertise-toggle", item)
              .setAttribute(
                "aria-expanded",
                "false"
              );
          }
        );

        if (!wasActive) {
          panel.classList.add("active");

          button.setAttribute(
            "aria-expanded",
            "true"
          );
        }
      });
    }
  );
}

function initContactForm() {
  const form = $("#contactForm");

  form?.addEventListener(
    "submit",
    (event) => {
      event.preventDefault();

      const data = new FormData(form);

      const name = String(
        data.get("name") || ""
      ).trim();

      const email = String(
        data.get("email") || ""
      ).trim();

      const projectType = String(
        data.get("projectType") || ""
      ).trim();

      const message = String(
        data.get("message") || ""
      ).trim();

      const subject = encodeURIComponent(
        `${projectType || "Portfolio inquiry"} from ${name}`
      );

      const body = encodeURIComponent(
        `Hi Sebastian,

My name is ${name}.
Email: ${email}
Project type: ${projectType}

Project details:
${message}

Thank you.`
      );

      window.location.href =
        `mailto:sebastianlevi2007@gmail.com?subject=${subject}&body=${body}`;
    }
  );

  $("#copyEmail")?.addEventListener(
    "click",
    async () => {
      try {
        await navigator.clipboard.writeText(
          "sebastianlevi2007@gmail.com"
        );

        showToast(
          "Email copied to clipboard"
        );
      } catch {
        showToast(
          "Email: sebastianlevi2007@gmail.com"
        );
      }
    }
  );
}

function initCursorGlow() {
  const glow = $("#cursorGlow");

  if (
    !glow ||
    reducedMotion ||
    window.matchMedia("(pointer: coarse)")
      .matches
  ) {
    return;
  }

  window.addEventListener(
    "pointermove",
    (event) => {
      glow.style.left =
        `${event.clientX}px`;

      glow.style.top =
        `${event.clientY}px`;
    },
    {
      passive: true
    }
  );
}

function initTilt() {
  if (
    reducedMotion ||
    window.matchMedia("(pointer: coarse)")
      .matches
  ) {
    return;
  }

  $$(".tilt-card").forEach((card) => {
    card.addEventListener(
      "pointermove",
      (event) => {
        const rect =
          card.getBoundingClientRect();

        const x =
          (event.clientX - rect.left) /
            rect.width -
          0.5;

        const y =
          (event.clientY - rect.top) /
            rect.height -
          0.5;

        const isDashboard =
          card.classList.contains(
            "dashboard-card"
          );

        const baseY =
          isDashboard ? -4 : 0;

        const baseX =
          isDashboard ? 2 : 0;

        card.style.transform = `
          perspective(1000px)
          rotateX(${baseX + y * -4}deg)
          rotateY(${baseY + x * 5}deg)
          translateY(-2px)
        `;
      }
    );

    card.addEventListener(
      "pointerleave",
      () => {
        card.style.transform = "";
      }
    );
  });
}

function initMagneticButtons() {
  if (
    reducedMotion ||
    window.matchMedia("(pointer: coarse)")
      .matches
  ) {
    return;
  }

  $$(".magnetic").forEach((button) => {
    button.addEventListener(
      "pointermove",
      (event) => {
        const rect =
          button.getBoundingClientRect();

        const x =
          event.clientX -
          rect.left -
          rect.width / 2;

        const y =
          event.clientY -
          rect.top -
          rect.height / 2;

        button.style.transform = `
          translate(
            ${x * 0.08}px,
            ${y * 0.12}px
          )
          translateY(-3px)
        `;
      }
    );

    button.addEventListener(
      "pointerleave",
      () => {
        button.style.transform = "";
      }
    );
  });
}

function initNetworkCanvas() {
  const canvas = $("#networkCanvas");

  if (!canvas || reducedMotion) {
    return;
  }

  const context =
    canvas.getContext("2d");

  if (!context) {
    return;
  }

  let width = 0;
  let height = 0;
  let particles = [];
  let animationId = 0;

  const dpr = Math.min(
    window.devicePixelRatio || 1,
    2
  );

  const createParticles = () => {
    const count = Math.max(
      28,
      Math.min(
        75,
        Math.floor(width / 22)
      )
    );

    particles = Array.from(
      { length: count },
      () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx:
          (Math.random() - 0.5) * 0.22,
        vy:
          (Math.random() - 0.5) * 0.22,
        radius:
          Math.random() * 1.4 + 0.55
      })
    );
  };

  const resize = () => {
    const rect =
      canvas.getBoundingClientRect();

    width = rect.width;
    height = rect.height;

    canvas.width =
      Math.floor(width * dpr);

    canvas.height =
      Math.floor(height * dpr);

    context.setTransform(
      dpr,
      0,
      0,
      dpr,
      0,
      0
    );

    createParticles();
  };

  const draw = () => {
    context.clearRect(
      0,
      0,
      width,
      height
    );

    const accent =
      getComputedStyle(root)
        .getPropertyValue("--accent")
        .trim() || "#5ee7ff";

    particles.forEach(
      (particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (
          particle.x < 0 ||
          particle.x > width
        ) {
          particle.vx *= -1;
        }

        if (
          particle.y < 0 ||
          particle.y > height
        ) {
          particle.vy *= -1;
        }

        context.beginPath();

        context.arc(
          particle.x,
          particle.y,
          particle.radius,
          0,
          Math.PI * 2
        );

        context.fillStyle = accent;
        context.globalAlpha = 0.38;
        context.fill();

        for (
          let indexTwo = index + 1;
          indexTwo < particles.length;
          indexTwo += 1
        ) {
          const other =
            particles[indexTwo];

          const differenceX =
            particle.x - other.x;

          const differenceY =
            particle.y - other.y;

          const distance = Math.hypot(
            differenceX,
            differenceY
          );

          if (distance > 120) {
            continue;
          }

          context.beginPath();

          context.moveTo(
            particle.x,
            particle.y
          );

          context.lineTo(
            other.x,
            other.y
          );

          context.strokeStyle = accent;

          context.globalAlpha =
            (1 - distance / 120) * 0.12;

          context.lineWidth = 0.65;
          context.stroke();
        }
      }
    );

    context.globalAlpha = 1;

    animationId =
      requestAnimationFrame(draw);
  };

  const resizeObserver =
    new ResizeObserver(resize);

  resizeObserver.observe(canvas);

  resize();
  draw();

  document.addEventListener(
    "visibilitychange",
    () => {
      if (document.hidden) {
        cancelAnimationFrame(animationId);
      } else {
        draw();
      }
    }
  );
}

function initYear() {
  const year = $("#year");

  if (year) {
    year.textContent =
      new Date().getFullYear();
  }
}

initTheme();
initHeader();
initReveal();
initRoleRotator();
initCounters();
initFilters();
initProjectModal();
initExpertiseAccordion();
initContactForm();
initCursorGlow();
initTilt();
initMagneticButtons();
initNetworkCanvas();
initYear();
