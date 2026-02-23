const LP_CONFIG = {
  businessHours: "8:00-20:00（年中無休）",
  contactEmail: "retoa@regalocom.net",
  contactFormUrl: "https://docs.google.com/forms/d/e/1FAIpQLSdbqMVhTDUHcfhnrv5Vj96aBF9WhyAwysTfmG9CdgElhrGm1A/viewform",
  companyName: "レトア",
  source: "letoa-lp-mvp",
};

const updateContactInfo = () => {
  const emailAnchors = document.querySelectorAll("[data-email-anchor]");
  const emailDisplays = document.querySelectorAll("[data-contact-email]");
  const hoursDisplays = document.querySelectorAll("[data-business-hours]");
  const formAnchors = document.querySelectorAll("[data-contact-form-url]");

  emailAnchors.forEach((anchor) => {
    anchor.setAttribute("href", `mailto:${LP_CONFIG.contactEmail}`);
  });

  emailDisplays.forEach((node) => {
    node.textContent = LP_CONFIG.contactEmail;
  });

  hoursDisplays.forEach((node) => {
    node.textContent = LP_CONFIG.businessHours;
  });

  formAnchors.forEach((anchor) => {
    anchor.setAttribute("href", LP_CONFIG.contactFormUrl);
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

  menuBtn.addEventListener("click", () => {
    const isHidden = mobileMenu.classList.toggle("hidden");
    menuBtn.setAttribute("aria-expanded", String(!isHidden));
    if (isHidden) {
      icon?.classList.remove("fa-xmark");
      icon?.classList.add("fa-bars");
    } else {
      icon?.classList.remove("fa-bars");
      icon?.classList.add("fa-xmark");
    }
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
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

const buildMailtoLink = (formData) => {
  const category = formData.get("category") || "その他";
  const subject = `[${LP_CONFIG.companyName}] ${category}のお問い合わせ`;

  const bodyLines = [
    "以下の内容でお問い合わせがありました。",
    "",
    `お名前: ${formData.get("name") || ""}`,
    `電話番号: ${formData.get("phone") || ""}`,
    `メールアドレス: ${formData.get("email") || ""}`,
    `お問い合わせ種別: ${category}`,
    "",
    "ご相談内容:",
    `${formData.get("message") || ""}`,
    "",
    `送信元: ${LP_CONFIG.source}`,
    `ページURL: ${window.location.href}`,
  ];

  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(bodyLines.join("\n"));
  return `mailto:${LP_CONFIG.contactEmail}?subject=${encodedSubject}&body=${encodedBody}`;
};

const initContactForm = () => {
  const form = document.getElementById("contact-form");
  const submitBtn = document.getElementById("submit-btn");
  const honeypot = document.getElementById("company");
  if (!form || !submitBtn || !honeypot) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    setStatus("", "");

    if (honeypot.value) {
      setStatus("送信に失敗しました。時間をおいて再度お試しください。", "error");
      return;
    }

    if (!form.reportValidity()) {
      setStatus("未入力の必須項目があります。", "error");
      return;
    }

    if (!LP_CONFIG.contactEmail) {
      setStatus("送信先メールが未設定です。", "error");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i>起動中...';

    try {
      const formData = new FormData(form);
      const mailtoLink = buildMailtoLink(formData);
      window.location.href = mailtoLink;
      setStatus("メール作成画面を開きました。開けない場合はGoogleフォームをご利用ください。", "success");
    } catch (error) {
      setStatus("メール画面を起動できませんでした。Googleフォームをご利用ください。", "error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane mr-2"></i>この内容で送信する';
    }
  });
};

document.addEventListener("DOMContentLoaded", () => {
  updateContactInfo();
  initMobileMenu();
  initFaq();
  initContactForm();
});
