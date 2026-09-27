/* MeridianCrest progressive quote form: 4 steps, validation, file checks,
   CRM-ready lead records in localStorage (swap for API endpoint when backend exists). */
(function(){
  "use strict";
  const $ = id => document.getElementById(id);
  const esc = s => window.MCI.escapeHTML(s);

  const LEAD_STATUSES = ["New","Contacted","Qualified","Specification Sent","Quotation Sent","Negotiation","Sample Requested","Sample Sent","Order Confirmed","Repeat Customer","Lost","Dormant"];

  const params = new URLSearchParams(location.search);
  const state = {
    step: 1,
    product: params.get("product") || "",
    form: "", qty: "", unit: "MT", price: "", pack: "", port: "", freq: "", country: "", city: "",
    spec: "", name: "", company: "", email: "", phone: "", consent: false, file: null, saveSpec: params.get("save") === "1"
  };

  const steps = ["Product", "Quantity + destination", "Specifications + packaging", "Contact + submit"];
  const bar = $("qBar"), label = $("qStep"), panels = [null, $("s1"), $("s2"), $("s3"), $("s4")];
  const backBtn = $("qBack"), nextBtn = $("qNext"), form = $("quoteForm");

  // product select options
  const sel = $("f-product");
  sel.innerHTML = '<option value="">Select a product…</option>' +
    CATEGORIES.map(c => '<optgroup label="' + esc(c.name) + '">' +
      PRODUCTS.filter(p => p.category === c.id).map(p => '<option value="' + p.slug + '"' + (p.slug === state.product ? " selected" : "") + '>' + esc(p.name) + '</option>').join("") + '</optgroup>').join("") +
    '<option value="multiple">Multiple / mixed requirement</option>';

  function paint(){
    label.textContent = "Step " + state.step + " / 4 — " + steps[state.step - 1];
    bar.style.width = (state.step / 4 * 100) + "%";
    panels.forEach((pn, i) => { if (pn) pn.hidden = (i !== state.step); });
    backBtn.hidden = state.step === 1;
    nextBtn.textContent = state.step === 4 ? "Submit Inquiry" : "Continue →";
    if (state.step === 4) renderReview();
  }
  function fieldError(id, msg){
    const e = $("e-" + id); if (e) e.textContent = msg || "";
    const f = $("f-" + id); if (f) f.classList.toggle("invalid", !!msg);
    return !msg;
  }
  const emailOk = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

  function validate(step){
    let ok = true;
    if (step === 1) ok = fieldError("product", sel.value ? "" : "Please select a product.") && ok;
    if (step === 2) {
      ok = fieldError("qty", $("f-qty").value.trim() ? "" : "Please enter the required quantity.") && ok;
      ok = fieldError("country", $("f-country").value.trim() ? "" : "Country is required.") && ok;
    }
    if (step === 4) {
      ok = fieldError("name", $("f-name").value.trim() ? "" : "Full name is required.") && ok;
      ok = fieldError("company", $("f-company").value.trim() ? "" : "Company name is required.") && ok;
      ok = fieldError("email", emailOk($("f-email").value.trim()) ? "" : "Enter a valid business email.") && ok;
      ok = fieldError("consent", $("f-consent").checked ? "" : "Please confirm consent to be contacted.") && ok;
    }
    return ok;
  }

  backBtn.addEventListener("click", () => { if (state.step > 1) { state.step--; paint(); } });
  nextBtn.addEventListener("click", () => {
    if (!validate(state.step)) return;
    if (state.step < 4) { state.step++; paint(); window.scrollTo({ top: 0, behavior: "smooth" }); }
    else submit();
  });

  // file validation (metadata only — no upload without backend)
  $("f-file").addEventListener("change", e => {
    const f = e.target.files[0]; const msg = $("e-file");
    state.file = null; msg.textContent = "";
    if (!f) return;
    const ext = (f.name.split(".").pop() || "").toLowerCase();
    const maxMB = (window.QUOTE_CONFIG || {}).maxFileMB || 10;
    const allowed = (window.QUOTE_CONFIG || {}).allowedTypes || ["pdf","docx","xlsx","jpg","png"];
    if (!allowed.includes(ext)) { msg.textContent = "File could not be uploaded. Please check the file type (" + allowed.join(", ").toUpperCase() + ")."; e.target.value = ""; return; }
    if (f.size > maxMB * 1024 * 1024) { msg.textContent = "File could not be uploaded. Maximum size is " + maxMB + " MB."; e.target.value = ""; return; }
    state.file = { name: f.name, sizeKB: Math.round(f.size / 1024), type: ext, note: "File metadata recorded; actual upload activates with backend storage." };
    msg.textContent = "Attached: " + f.name + " (" + state.file.sizeKB + " KB)";
  });

  function renderReview(){
    const p = PRODUCTS.find(x => x.slug === sel.value);
    $("review").innerHTML = "<b>Product:</b> " + esc(p ? p.name : sel.value || "—") + "<br>" +
      "<b>Quantity:</b> " + esc($("f-qty").value + " " + $("f-unit").value) + "<br>" +
      "<b>Destination:</b> " + esc($("f-port").value + ", " + $("f-country").value + " " + $("f-city").value) + "<br>" +
      "<b>Contact:</b> " + esc($("f-name").value + " — " + $("f-company").value + " (" + $("f-email").value + ")");
  }

  function submit(){
    const id = "MCI-" + Date.now().toString(36).toUpperCase();
    const lead = {
      leadId: id, date: new Date().toISOString(), status: "New",
      company: $("f-company").value.trim(), contactName: $("f-name").value.trim(), email: $("f-email").value.trim(),
      phone: $("f-phone").value.trim(), country: $("f-country").value.trim(), city: $("f-city").value.trim(),
      product: sel.value, productForm: $("f-form").value.trim(), quantity: $("f-qty").value.trim(), unit: $("f-unit").value,
      targetPrice: $("f-price").value.trim(), packaging: $("f-pack").value.trim(), destinationPort: $("f-port").value.trim(),
      frequency: $("f-freq").value, specification: $("f-spec").value.trim(), attachment: state.file,
      consent: $("f-consent").checked, assignedSalesperson: "", lastContact: "", nextFollowup: "", quoteStatus: "", customerStatus: "Prospect"
    };
    try {
      const all = JSON.parse(localStorage.getItem("mci_leads") || "[]");
      all.push(lead); localStorage.setItem("mci_leads", JSON.stringify(all));
      if (state.saveSpec) {
        const specs = JSON.parse(localStorage.getItem("mci_saved_specs") || "[]");
        specs.push({ savedAt: lead.date, leadId: id, product: lead.product, form: lead.productForm, qty: lead.quantity + " " + lead.unit, port: lead.destinationPort, pack: lead.packaging });
        localStorage.setItem("mci_saved_specs", JSON.stringify(specs));
      }
      window.MCI.track("quote_submitted", { leadId: id, product: lead.product });
      if (state.saveSpec) window.MCI.track("spec_saved", { leadId: id });
      form.hidden = true;
      $("done").hidden = false;
      $("doneRef").textContent = id;
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      const e = $("submitErr"); e.hidden = false;
      e.textContent = "Something went wrong. Please try again or contact us directly.";
    }
  }

  // prefill notice
  if (state.product) {
    const p = PRODUCTS.find(x => x.slug === state.product);
    if (p) $("prefill").innerHTML = 'Product preselected: <b>' + esc(p.name) + '</b>. <a href="product.html?slug=' + p.slug + '">Review specs</a>';
  }
  window.MCI.track("quote_started", { product: state.product || "none" });
  paint();
})();
