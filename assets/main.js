const LP_CONFIG = {
  businessHours: "9:00-20:00",
  contactEmail: "retoa@regalocom.net",
  phoneDisplay: "070-9131-7882",
  phoneLink: "07091317882",
  formEndpoint: "https://formsubmit.co/ajax/retoa@regalocom.net",
  companyName: "レトア",
  source: "letoa-lp-mvp",
};

const PHONE_REGEX = /^[0-9+\-()\s]{9,15}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_MAILTO_URL_LENGTH = 1800;

const sanitize = (value) => value.trim().replace(/\s+/g, " ");

const normalizePhoneHrefValue = (rawPhone) => {
  let normalized = String(rawPhone || "").trim().replace(/[^\d+]/g, "");
  if (!normalized) {
    return "07091317882";
  }

  if (normalized.startsWith("+")) {
    normalized = `+${normalized.slice(1).replace(/\+/g, "")}`;
  } else {
    normalized = normalized.replace(/\+/g, "");
  }

  return normalized;
};

const updateContactInfo = () => {
  const emailAnchors = document.querySelectorAll("[data-email-anchor]");
  const emailDisplays = document.querySelectorAll("[data-contact-email]");
  const hoursDisplays = document.querySelectorAll("[data-business-hours]");
  const phoneAnchors = document.querySelectorAll("[data-phone-anchor]");
  const phoneDisplays = document.querySelectorAll("[data-phone-display]");

  const phoneHrefValue = normalizePhoneHrefValue(LP_CONFIG.phoneLink || LP_CONFIG.phoneDisplay);
  const phoneHref = `tel:${phoneHrefValue}`;

  emailAnchors.forEach((anchor) => {
    anchor.setAttribute("href", `mailto:${LP_CONFIG.contactEmail}`);
  });

  emailDisplays.forEach((node) => {
    node.textContent = LP_CONFIG.contactEmail;
  });

  hoursDisplays.forEach((node) => {
    node.textContent = LP_CONFIG.businessHours;
  });

  phoneAnchors.forEach((anchor) => {
    anchor.setAttribute("href", phoneHref);
  });

  phoneDisplays.forEach((node) => {
    node.textContent = LP_CONFIG.phoneDisplay;
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

const initRevealEffects = () => {
  const revealItems = document.querySelectorAll(".reveal-item");
  if (!revealItems.length) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || typeof IntersectionObserver === "undefined") {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, observeRef) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observeRef.unobserve(entry.target);
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -36px 0px",
    }
  );

  revealItems.forEach((item) => observer.observe(item));
};

const initHeaderState = () => {
  const header = document.getElementById("site-header");
  if (!header) return;

  const onScroll = () => {
    const shouldElevate = window.scrollY > 12;
    header.classList.toggle("is-scrolled", shouldElevate);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
};

const initMessageCounter = () => {
  const message = document.getElementById("message");
  const counter = document.getElementById("message-count");
  if (!message || !counter) return;

  const updateCount = () => {
    counter.textContent = String(message.value.length);
  };

  message.addEventListener("input", updateCount);
  updateCount();
};

const initPhoneLinkBehavior = () => {
  const phoneAnchors = document.querySelectorAll("[data-phone-anchor]");
  if (!phoneAnchors.length) return;

  phoneAnchors.forEach((anchor) => {
    if (!anchor.getAttribute("aria-label")) {
      anchor.setAttribute("aria-label", `電話で相談する ${LP_CONFIG.phoneDisplay}`);
    }

    anchor.addEventListener("click", () => {
      if (!Array.isArray(window.dataLayer)) return;
      window.dataLayer.push({
        event: "lp_phone_click",
        phone: LP_CONFIG.phoneDisplay,
        source: LP_CONFIG.source,
      });
    });
  });
};

const syncStructuredData = () => {
  const ldJson = document.getElementById("ld-json-local-business");
  if (!ldJson) return;

  try {
    const data = JSON.parse(ldJson.textContent || "{}");
    data.url = new URL("./", window.location.href).href;
    data.telephone = LP_CONFIG.phoneDisplay;
    if (data.contactPoint && typeof data.contactPoint === "object") {
      data.contactPoint.telephone = LP_CONFIG.phoneDisplay;
    }
    ldJson.textContent = JSON.stringify(data);
  } catch (error) {
    // no-op
  }
};

const setStatus = (message, statusType) => {
  const statusEl = document.getElementById("contact-status");
  if (!statusEl) return;

  statusEl.textContent = message;
  statusEl.classList.remove("is-success", "is-error");

  if (statusType === "success") statusEl.classList.add("is-success");
  if (statusType === "error") statusEl.classList.add("is-error");
};

const buildMailtoLink = (fields) => {
  const subject = `[${LP_CONFIG.companyName}] ${fields.category}のお問い合わせ`;
  const bodyLines = [
    "以下の内容でお問い合わせがありました。",
    "",
    `お名前: ${fields.name}`,
    `電話番号: ${fields.phone}`,
    `メールアドレス: ${fields.email}`,
    `お問い合わせ種別: ${fields.category}`,
    `ご連絡希望時間帯: ${fields.preferredContact}`,
    `緊急対応希望: ${fields.isUrgent}`,
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

const buildApiPayload = (fields) => ({
  _subject: `[${LP_CONFIG.companyName}] ${fields.category}のお問い合わせ`,
  _template: "table",
  _captcha: "false",
  source: LP_CONFIG.source,
  pageUrl: window.location.href,
  name: fields.name,
  phone: fields.phone,
  email: fields.email,
  category: fields.category,
  preferredContact: fields.preferredContact,
  isUrgent: fields.isUrgent,
  message: fields.message,
});

const submitFormViaApi = async (fields) => {
  const response = await fetch(LP_CONFIG.formEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(buildApiPayload(fields)),
  });

  if (!response.ok) {
    throw new Error(`api_status_${response.status}`);
  }

  const json = await response.json().catch(() => null);
  const isSuccess = json && (json.success === true || json.success === "true");
  if (!isSuccess) {
    throw new Error("api_invalid_response");
  }

  return json;
};

const collectFormFields = (form) => {
  const formData = new FormData(form);

  return {
    name: sanitize(String(formData.get("name") || "")),
    phone: sanitize(String(formData.get("phone") || "")),
    email: sanitize(String(formData.get("email") || "")),
    category: sanitize(String(formData.get("category") || "その他")),
    preferredContact: sanitize(String(formData.get("preferredContact") || "指定なし")),
    isUrgent: formData.get("isUrgent") ? "希望する" : "通常",
    message: String(formData.get("message") || "").trim(),
  };
};

const validateFormFields = (fields, consentChecked) => {
  if (!fields.name || !fields.phone || !fields.email || !fields.message) {
    return "未入力の必須項目があります。";
  }

  if (!EMAIL_REGEX.test(fields.email)) {
    return "メールアドレスの形式が正しくありません。";
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
  const honeypot = document.getElementById("contact_company");
  const consent = document.getElementById("consent");

  if (!form || !submitBtn || !honeypot || !consent) return;

  const defaultButtonHtml = submitBtn.innerHTML;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    setStatus("", "");

    if (!form.reportValidity()) {
      setStatus("未入力または形式エラーがあります。", "error");
      return;
    }

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
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i>送信準備中...';

    try {
      await submitFormViaApi(fields);
      setStatus("送信を受け付けました。担当より折り返しご連絡します。", "success");
      form.reset();
      const messageCounter = document.getElementById("message-count");
      if (messageCounter) {
        messageCounter.textContent = "0";
      }
    } catch (apiError) {
      const mailtoLink = buildMailtoLink(fields);
      if (mailtoLink.length > MAX_MAILTO_URL_LENGTH) {
        setStatus("送信に失敗しました。ご相談内容を短くするか、お電話でご連絡ください。", "error");
        return;
      }

      try {
        window.location.assign(mailtoLink);
        setStatus("フォーム送信に失敗したため、メール作成画面を開きました。内容確認のうえ送信してください。", "error");
      } catch (mailtoError) {
        setStatus("送信に失敗しました。お手数ですが電話かメールで直接ご連絡ください。", "error");
      }
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = defaultButtonHtml;
    }
  });
};

document.addEventListener("DOMContentLoaded", () => {
  updateContactInfo();
  initHeaderState();
  initMobileMenu();
  initPhoneLinkBehavior();
  syncStructuredData();
  initRevealEffects();
  initFaq();
  initMessageCounter();
  initContactForm();
});
