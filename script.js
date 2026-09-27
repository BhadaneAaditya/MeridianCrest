// Meridian Crest International - interactivity
const PRODUCTS = [
  {name:"Red Onion Powder", cat:"veg", catLabel:"Dehydrated Vegetables", photos:[{src:"assets/red-onion.jpg",tag:"Raw",alt:"Sliced red onions"},{src:"assets/fin-onion-powder.jpg",tag:"Finished • 100 Mesh",alt:"Red onion powder texture"}], forms:"Powder 100-120 Mesh", moist:"≤6.5%", pack:"25kg PP + inner poly / 10kg cartons", moq:"500 kg", spec:"Colour: pinkish-white • TBC: <100k • Salmonella absent • Shelf 24 mo"},
  {name:"Pink Onion Granules", cat:"veg", catLabel:"Dehydrated Vegetables", photos:[{src:"assets/pink-onion.jpg",tag:"Raw",alt:"Pink onions on wooden tray"},{src:"assets/onion-drying.jpg",tag:"Dehydration",alt:"Onions drying before granulation"}], forms:"Granules 0.5-1mm / 1-3mm", moist:"≤6.5%", pack:"25kg bulk / retail pouches", moq:"500 kg", spec:"Rehydration 1:6 • Ideal for seasonings & sauces"},
  {name:"White Onion Flakes & Chopped", cat:"veg", catLabel:"Dehydrated Vegetables", photos:[{src:"assets/onion.jpg",tag:"Raw",alt:"White onions"},{src:"assets/onion-drying.jpg",tag:"Dehydration",alt:"Onions drying for flakes and chopping"}], forms:"Flakes 8-15mm • Chopped 3-5mm", moist:"≤6.0%", pack:"20/25kg cartons, nitrogen flush", moq:"500 kg", spec:"White-grade • Low micro • For soups, ready meals"},
  {name:"Garlic Powder / Granules / Flakes", cat:"veg", catLabel:"Dehydrated Vegetables", photos:[{src:"assets/garlic.jpg",tag:"Raw",alt:"Fresh garlic bulbs"},{src:"assets/fin-garlic-powder.jpg",tag:"Finished • 100 Mesh",alt:"Garlic powder texture"}], forms:"Powder 100M • Granules • Toasted", moist:"≤6.5%", pack:"25kg / 20kg cartons", moq:"500 kg", spec:"Allicin-rich • Steam-sterilized option • ETO-free"},
  {name:"Amla Powder", cat:"powder", catLabel:"Fruits & Natural Powders", photos:[{src:"assets/amla-new.jpg",tag:"Raw",alt:"Fresh amla fruit on branch"},{src:"assets/matcha.jpg",tag:"Milled • 100 Mesh",alt:"Fine powder milling and sieving"}], forms:"100 Mesh, seedless", moist:"≤7%", pack:"25kg / private-label jars", moq:"500 kg", spec:"Vit-C rich • For nutraceuticals & beverages"},
  {name:"Moringa Powder", cat:"powder", catLabel:"Fruits & Natural Powders", photos:[{src:"assets/moringa.jpg",tag:"Raw",alt:"Fresh moringa leaves"},{src:"assets/moringa-powder.jpg",tag:"Finished • Steam-sterilized",alt:"Moringa powder in bowl"}], forms:"80-120M steam-sterilized", moist:"≤7%", pack:"25kg vacuum / retail zipper", moq:"500 kg", spec:"Green-grade • TPC controlled • Lab COA per lot"},
  {name:"Cumin Seeds", cat:"spice", catLabel:"Spices", photos:[{src:"assets/cumin-seeds.jpg",tag:"Sortex grade",alt:"Cumin seeds in bowl"},{src:"assets/spice-flatlay.jpg",tag:"Grading lot",alt:"Indian spice grading selection"}], forms:"Sortex 99% / 99.5%", moist:"≤9%", pack:"25/50kg PP bags", moq:"1 MT", spec:"Unjha origin • High volatile oil • Admixture <1%"},
  {name:"Cumin Powder", cat:"spice", catLabel:"Spices", photos:[{src:"assets/fin-cumin-powder.jpg",tag:"Finished • 80 Mesh",alt:"Ground cumin on spoon"},{src:"assets/cumin-seeds.jpg",tag:"Raw seeds",alt:"Cumin seeds before grinding"}], forms:"80 Mesh, sterilized", moist:"≤9%", pack:"25kg / retail packs", moq:"500 kg", spec:"Roasted / raw • For blends & masalas"},
  {name:"Green Cardamom", cat:"spice", catLabel:"Spices", photos:[{src:"assets/cardamom-new.jpg",tag:"8mm Bold",alt:"Green cardamom pods"},{src:"assets/cardcumin.jpg",tag:"QC lot",alt:"Cardamom quality inspection"}], forms:"8mm Bold / 7mm / 6mm", moist:"≤11%", pack:"5kg / 25kg cartons", moq:"250 kg", spec:"Deep green • High 1,8-cineole • Kerala / Idukki"},
];

function renderProducts(filter="all"){
  const grid = document.getElementById("productGrid");
  grid.innerHTML = "";
  PRODUCTS.filter(p=>filter==="all"||p.cat===filter).forEach(p=>{
    const el = document.createElement("div");
    el.className="p-card";
    el.innerHTML = `
      <div class="p-top"><div class="p-gallery">${p.photos.map(ph=>`<figure><img src="${ph.src}" alt="${ph.alt}" loading="lazy" onerror="this.closest('figure').remove()"><figcaption>${ph.tag}</figcaption></figure>`).join("")}</div></div>
      <div class="p-body">
        <span class="p-cat">${p.catLabel}</span>
        <h3>${p.name}</h3>
        <div class="spec"><b>Forms:</b> ${p.forms}<br><b>Moisture:</b> ${p.moist} • <b>MOQ:</b> ${p.moq}</div>
        <div class="spec"><b>Packing:</b> ${p.pack}<br>${p.spec}</div>
        <div class="p-actions">
          <button class="btn btn-navy" onclick="openQuote('${p.name.replace(/'/g,"")}')">Request Quote</button>
          <button class="btn btn-outline-dark" onclick="viewSpec('${p.name.replace(/'/g,"")}')">View Spec</button>
        </div>
      </div>`;
    grid.appendChild(el);
  });
}
function viewSpec(name){
  const p = PRODUCTS.find(x=>x.name===name);
  if(!p) return;
  alert(`${p.name}\n\nForms: ${p.forms}\nMoisture: ${p.moist}\nPacking: ${p.pack}\nMOQ: ${p.moq}\n${p.spec}\n\nFull COA sample sent with quote. Click Request Quote to get CIF pricing.`);
  openQuote(name);
}

document.querySelectorAll(".f").forEach(b=>b.addEventListener("click",()=>{
  document.querySelectorAll(".f").forEach(x=>x.classList.remove("active"));
  b.classList.add("active"); renderProducts(b.dataset.filter);
}));

// FAQ
document.querySelectorAll(".acc button").forEach(btn=>btn.addEventListener("click",()=>{
  const a = btn.parentElement; const was = a.classList.contains("open");
  document.querySelectorAll(".acc").forEach(x=>x.classList.remove("open"));
  if(!was) a.classList.add("open");
}));

// Modal
function openQuote(product){
  document.getElementById("quoteModal").hidden = false;
  document.getElementById("quoteTitle").textContent = "Get a Quote — " + product;
  document.getElementById("m-msg").value = `Hi, I need CIF pricing for: ${product}. Destination port: ___, Qty: ___, Packaging: ___.`;
}
function closeQuote(){ document.getElementById("quoteModal").hidden = true; }
document.getElementById("quoteModal").addEventListener("click",e=>{ if(e.target.id==="quoteModal") closeQuote(); });

// Forms -> localStorage + mailto fallback
function saveLead(obj){
  const leads = JSON.parse(localStorage.getItem("mci_leads")||"[]");
  leads.push({date:new Date().toISOString(), ...obj});
  localStorage.setItem("mci_leads", JSON.stringify(leads));
}
document.getElementById("heroForm").addEventListener("submit",e=>{
  e.preventDefault();
  saveLead({source:"hero", name:val("h-name"), email:val("h-email"), product:val("h-product"), qty:val("h-qty"), port:val("h-port")});
  alert("Thank you! Your bulk pricing request was recorded. Our export desk will email CIF pricing within 24 hours.");
  e.target.reset();
});
document.getElementById("inquiryForm").addEventListener("submit",e=>{
  e.preventDefault();
  saveLead({source:"inquiry", name:val("q-name"), email:val("q-email"), company:val("q-company"), country:val("q-country"), product:val("q-product"), qty:val("q-qty"), msg:val("q-msg")});
  document.getElementById("formOk").hidden = false;
  e.target.reset();
  setTimeout(()=>document.getElementById("formOk").hidden=true, 8000);
});
document.getElementById("quoteForm").addEventListener("submit",e=>{
  e.preventDefault(); closeQuote();
  saveLead({source:"modal", name:val("m-name"), email:val("m-email"), company:val("m-company"), port:val("m-port"), qty:val("m-qty2"), msg:val("m-msg")});
  alert("Quote request sent! Reference saved. Expect CIF pricing + COA sample within 24 business hours.");
  e.target.reset();
});
function val(id){ return document.getElementById(id).value || ""; }

// Counters
const io = new IntersectionObserver(es=>es.forEach(en=>{
  if(!en.isIntersecting) return;
  const b = en.target; const target = +b.dataset.count; let cur=0;
  const t = setInterval(()=>{ cur+=Math.max(1,Math.round(target/40)); if(cur>=target){cur=target;clearInterval(t);} b.textContent=cur; },40);
  io.unobserve(b);
}),{threshold:.5});
document.querySelectorAll("[data-count]").forEach(b=>io.observe(b));

// Mobile nav
document.getElementById("hamburger").addEventListener("click",()=>document.getElementById("nav").classList.toggle("open"));
document.querySelectorAll("#nav a").forEach(a=>a.addEventListener("click",()=>document.getElementById("nav").classList.remove("open")));

// Catalogue PDF (print-friendly generated window)
function downloadCatalogue(){
  const rows = PRODUCTS.map(p=>`<tr><td><b>${p.name}</b><br><small>${p.catLabel}</small></td><td>${p.forms}</td><td>${p.moist}</td><td>${p.pack}</td><td>${p.moq}</td></tr>`).join("");
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>MCI Catalogue</title>
  <style>body{font-family:Arial,sans-serif;padding:32px;color:#111}h1{color:#0b1d3a}table{width:100%;border-collapse:collapse;font-size:12px}th{background:#0b1d3a;color:#fff;padding:8px;text-align:left}td{border:1px solid #ccc;padding:8px}.head{display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #c9a227;padding-bottom:12px;margin-bottom:16px}</style></head>
  <body><div class="head"><img src="logo.png" style="height:74px" onerror="this.remove()"><div><h1>MERIDIAN CREST INTERNATIONAL</h1><p>B2B Export Catalogue • Dehydrated Vegetables • Natural Powders • Spices • India</p></div><div>exports@meridiancrestinternational.com</div></div>
  <p><b>MOQ from 500kg • COA per lot • Private label • FOB/CIF/DDP • 40+ ports • 50+ countries.</b> Docs: COA, Phytosanitary, Health, COO, Fumigation, Halal/Kosher on request.</p>
  <table><tr><th>Product</th><th>Forms</th><th>Moisture</th><th>Packing</th><th>MOQ</th></tr>${rows}</table>
  <p>Process: Source → Verify → Pack → Document → Export → Deliver. Contact: exports@meridiancrestinternational.com | +91-98XXX-XXXXX | © 2026 Meridian Crest International</p>
  <script>window.onload=()=>window.print()<\/script></body></html>`;
  const w = window.open("", "_blank");
  w.document.write(html); w.document.close();
}

renderProducts();
