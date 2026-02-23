const LP_CONFIG = {
  businessHours: "8:00-20:00（年中無休）",
  contactEmail: "retoa@regalocom.net",
  companyName: "レトア",
  source: "letoa-lp-mvp",
};

const PHONE_REGEX = /^[0-9+\-()\s]{9,15}$/;

const updateContactInfo = () => {
  const emailAnchors = document.querySelectorAll("[data-email-anchor]");
  const emailDisplays = document.querySelectorAll("[data-contact-email]");
  const hoursDisplays = document.querySelectorAll("[data-business-hours]");

  emailAnchors.forEach((anchor) => {
    anchor.setAttribute("href", `mailto:${LP_CONFIG.contactEmail}`);
  });

  emailDisplays.forEach((node) => {
    node.textContent = LP_CONFIG.contactEmail;
  });

  hoursDisplays.forEach((node) => {
    node.textContent = LP_CONFIG.businessHours;
  });
};

const initMobileMenu = () => {
  const menuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  if (!menuBtn || !mobileMenu) return;

  const icon = menuBtn.querySelector("i");

  const closeMenu = () => {
    mobileMenu.classList.add("hidden");
    menuBtn.setAttribute("aria-expanded", "false");
    icon?.classList.remove("fa-xmark");
    icon?.classList.add("fa-bars");
  };

  const openMenu = () => {
    mobileMenu.classList.remove("hidden");
    menuBtn.setAttribute("aria-expanded", "true");
    icon?.classList.remove("fa-bars");
    icon?.classList.add("fa-xmark");
  };

  menuBtn.addEventListener("click", () => {
    const isHidden = mobileMenu.classList.contains("hidden");
    if (isHidden) {
      openMenu();
    } else {
      closeMenu();
    }
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (event) => {
    const isOpen = !mobileMenu.classList.contains("hidden");
    if (!isOpen) return;
    if (!mobileMenu.contains(event.target) && !menuBtn.contains(event.target)) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
};

const initFaq = () => {
  const detailsList = document.querySelectorAll("details");
  detailsList.forEach((detail) => {
    detail.addEventListener("toggle", () => {
      if (!detail.open) return;
      detailsList.forEach((other) => {
        if (other !== detail) other.open = false;
      });
    });
  });
};

const setStatus = (message, statusType) => {
  const statusEl = document.getElementById("contact-status");
  if (!statusEl) return;
  statusEl.textContent = message;
  statusEl.classList.remove("is-success", "is-error");
  if (statusType === "success") statusEl.classList.add("is-success");
  if (statusType === "error") statusEl.classList.add("is-error");
};

const sanitize = (value) => value.trim().replace(/\s+/g, " ");

const buildMailtoLink = (fields) => {
  const subject = `[${LP_CONFIG.companyName}] ${fields.category}のお問い合わせ`;
  const bodyLines = [
    "以下の内容でお問い合わせがありました。",
    "",
    `お名前: ${fields.name}`,
    `電話番号: ${fields.phone}`,
    `メールアドレス: ${fields.email}`,
    `お問い合わせ種別: ${fields.category}`,
    "",
    "ご相談内容:",
    fields.message,
    "",
    `送信元: ${LP_CONFIG.source}`,
    `ページURL: ${window.location.href}`,
  ];

  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(bodyLines.join("\n"));
  return `mailto:${LP_CONFIG.contactEmail}?subject=${encodedSubject}&body=${encodedBody}`;
};

const collectFormFields = (form) => {
  const formData = new FormData(form);
  return {
    name: sanitize(String(formData.get("name") || "")),
    phone: sanitize(String(formData.get("phone") || "")),
    email: sanitize(String(formData.get("email") || "")),
    category: sanitize(String(formData.get("category") || "その他")),
    message: String(formData.get("message") || "").trim(),
  };
};

const validateFormFields = (fields, consentChecked) => {
  if (!fields.name || !fields.phone || !fields.email || !fields.message) {
    return "未入力の必須項目があります。";
  }

  if (!PHONE_REGEX.test(fields.phone)) {
    return "電話番号の形式が正しくありません。";
  }

  if (fields.message.length < 10) {
    return "ご相談内容は10文字以上で入力してください。";
  }

  if (!consentChecked) {
    return "個人情報の取扱いへの同意が必要です。";
  }

  return "";
};

const initContactForm = () => {
  const form = document.getElementById("contact-form");
  const submitBtn = document.getElementById("submit-btn");
  const honeypot = document.getElementById("company");
  const consent = document.getElementById("consent");
  if (!form || !submitBtn || !honeypot || !consent) return;

  const defaultButtonHtml = submitBtn.innerHTML;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    setStatus("", "");

    if (honeypot.value) {
      setStatus("送信に失敗しました。時間をおいて再度お試しください。", "error");
      return;
    }

    if (!LP_CONFIG.contactEmail) {
      setStatus("送信先メールが未設定です。", "error");
      return;
    }

    const fields = collectFormFields(form);
    const error = validateFormFields(fields, consent.checked);
    if (error) {
      setStatus(error, "error");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i>起動中...';

    try {
      const mailtoLink = buildMailtoLink(fields);
      window.location.assign(mailtoLink);
      setStatus("メール作成画面を開きました。送信を完了してください。", "success");
    } catch (errorCaught) {
      setStatus("メール画面を起動できませんでした。メールアドレスへ直接ご連絡ください。", "error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = defaultButtonHtml;
    }
  });
};

document.addEventListener("DOMContentLoaded", () => {
  updateContactInfo();
  initMobileMenu();
  initFaq();
  initContactForm();
});

