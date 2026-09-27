/* MeridianCrest shared site behaviors: nav, contact binding, stats placeholders,
   reveal animations, lightweight analytics events. No framework, minimal JS. */
(function(){
  "use strict";
  const $ = (s, c=document) => c.querySelector(s);
  const $$ = (s, c=document) => Array.from(c.querySelectorAll(s));

  /* ---------- analytics stub: window.MCI.track(event, data) ----------
     Wire to GA / privacy-friendly analytics by adding the provider snippet
     and forwarding here. Events: product_view, product_search, catalogue_download,
     quote_started, quote_submitted, whatsapp_clicked, email_clicked, faq_opened,
     guide_requested, reorder_started */
  window.dataLayer = window.dataLayer || [];
  window.MCI = window.MCI || {};
  window.MCI.track = function(event, data){
    window.dataLayer.push(Object.assign({ event }, data || {}));
  };
  $$("[data-track]").forEach(el => el.addEventListener("click", () => {
    window.MCI.track(el.getAttribute("data-track"), { page: location.pathname });
  }));

  /* ---------- mobile nav ---------- */
  const burger = $("#hamburger"), nav = $("#mainnav");
  if (burger && nav) {
    burger.addEventListener("click", () => nav.classList.toggle("open"));
    $$("#mainnav a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));
  }
  // active link
  const page = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  $$("#mainnav a").forEach(a => {
    const href = (a.getAttribute("href") || "").toLowerCase();
    if (href === page || (page === "" && href === "index.html")) a.classList.add("active");
  });

  /* ---------- contact binding from COMPANY_CONFIG ---------- */
  const cfg = window.COMPANY_CONFIG || {};
  const emailEls = $$('[data-contact="email"]');
  const waEls = $$('[data-contact="whatsapp"]');
  const phoneEls = $$('[data-contact="phone"]');
  const addrEls = $$('[data-contact="address"]');
  if (cfg.contactConfigured) {
    emailEls.forEach(el => { el.innerHTML = ""; const a=document.createElement("a"); a.href="mailto:"+cfg.email; a.textContent=cfg.email; a.setAttribute("data-track","email_clicked"); el.appendChild(a); });
    waEls.forEach(el => { el.innerHTML = ""; const a=document.createElement("a"); a.href="https://wa.me/"+cfg.whatsapp; a.target="_blank"; a.rel="noopener"; a.textContent="WhatsApp: +"+cfg.whatsapp; a.setAttribute("data-track","whatsapp_clicked"); el.appendChild(a); });
    phoneEls.forEach(el => { el.textContent = cfg.phone; });
    addrEls.forEach(el => { el.textContent = cfg.address; });
    const fabWa = $("#fabWa");
    if (fabWa && cfg.whatsapp && cfg.whatsapp !== "ADD_WHATSAPP") {
      fabWa.href = "https://wa.me/" + cfg.whatsapp;
      fabWa.addEventListener("click", () => window.MCI.track("whatsapp_clicked", {}));
    }
  } else {
    emailEls.forEach(el => { el.innerHTML = '<a href="contact.html">Contact us for email</a>'; });
    waEls.forEach(el => { el.innerHTML = '<a href="contact.html">Contact us for WhatsApp</a>'; });
    phoneEls.forEach(el => { el.textContent = "Available on request — see Contact page"; });
    addrEls.forEach(el => { el.textContent = "India — full address shared on confirmed inquiry"; });
  }
  const fabMail = $("#fabMail");
  if (fabMail) {
    if (cfg.contactConfigured) fabMail.href = "mailto:" + cfg.email;
    fabMail.addEventListener("click", () => window.MCI.track("email_clicked", {}));
  }

  /* ---------- market stats: verified numbers or neutral placeholders ---------- */
  $$("[data-stat]").forEach(el => {
    const key = el.getAttribute("data-stat");
    const s = (window.SITE_STATS || {})[key];
    if (s && s.verified) {
      el.innerHTML = "<b>" + s.value + (s.suffix || "") + "</b><span>" + s.label + "</span>";
    } else {
      el.innerHTML = '<b class="aor">—</b><span>Global Markets Served</span>';
      el.setAttribute("title", "Add verified market data");
    }
  });

  /* ---------- reveal on scroll ---------- */
  const io = ("IntersectionObserver" in window) ? new IntersectionObserver(es => es.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add("visible"); io.unobserve(en.target); }
  }), { threshold: .12 }) : null;
  $$(".reveal").forEach(el => io ? io.observe(el) : el.classList.add("visible"));

  /* ---------- footer year ---------- */
  $$("[data-year]").forEach(el => { el.textContent = new Date().getFullYear(); });

  /* ---------- FAQ accordion (progressive enhancement) ---------- */
  $$(".acc > button").forEach(btn => btn.addEventListener("click", () => {
    const item = btn.parentElement;
    const was = item.classList.contains("open");
    $$(".acc.open").forEach(x => x.classList.remove("open"));
    if (!was) { item.classList.add("open"); window.MCI.track("faq_opened", { q: btn.textContent.trim().slice(0,80) }); }
  }));

  /* ---------- input sanitization helper ---------- */
  window.MCI.escapeHTML = function(str){
    return String(str == null ? "" : str).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  };
})();
