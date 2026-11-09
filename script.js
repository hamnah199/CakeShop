const products = [
  {id:"chocolate-delight",name:"Chocolate Delight",category:"Birthday",price:2499,rating:"4.9",reviews:120,description:"A rich, soft chocolate cake layered with smooth chocolate cream and finished with a delicious chocolate drizzle.",image:"https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=90"},
  {id:"red-velvet",name:"Red Velvet Cake",category:"Anniversary",price:2699,rating:"4.9",reviews:90,description:"A soft red velvet cake with a delicate flavour and a creamy frosting. A beautiful choice for a special day.",image:"https://images.unsplash.com/photo-1586788680434-30d324b2d46f?auto=format&fit=crop&w=1000&q=90"},
  {id:"black-forest",name:"Black Forest Cake",category:"Birthday",price:2399,rating:"4.8",reviews:110,description:"A classic favourite with chocolate, cream and cherry-inspired decoration. Made fresh for your celebration.",image:"https://images.unsplash.com/photo-1542826438-bd32f43d626f?auto=format&fit=crop&w=1000&q=90"},
  {id:"mango-cake",name:"Mango Cake",category:"Anniversary",price:2299,rating:"4.8",reviews:85,description:"A light and lovely cake with mango flavour and a smooth creamy finish.",image:"https://images.unsplash.com/photo-1562777717-dc6984f65a63?auto=format&fit=crop&w=1000&q=90"},
  {id:"vanilla-bliss",name:"Vanilla Bliss",category:"Wedding",price:2899,rating:"4.9",reviews:74,description:"A timeless vanilla cake with elegant decoration, perfect for sharing with family and friends.",image:"https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=85"},
  {id:"berry-cupcakes",name:"Berry Cupcakes",category:"Cupcakes",price:1299,rating:"4.8",reviews:62,description:"A box of soft cupcakes topped with fluffy frosting. A sweet little treat for any occasion.",image:"https://images.unsplash.com/photo-1486427944299-d1955d23e34d?auto=format&fit=crop&w=1000&q=90"}
];

const config = window.CAKESHOP_CONFIG || {};
const number = (config.whatsappNumber || "").replace(/\D/g,"");
const money = n => `${config.currency || "Rs."} ${n.toLocaleString("en-PK")}`;
function whatsappLink(message) {
  return number ? `https://wa.me/${number}?text=${encodeURIComponent(message)}` : "#";
}
function setWhatsAppLinks() {
  const msg = "Hello CakeShop! I'd like to ask about your cakes.";
  ["custom-whatsapp","footer-wa","footer-order"].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.href = whatsappLink(msg); el.target = "_blank"; el.rel = "noopener"; }
  });
}
function productCard(p) {
  return `<article class="product-card">
    <a class="product-image" href="product.html?id=${p.id}"><img src="${p.image}" alt="${p.name}" loading="lazy"><span class="view-label">VIEW PRODUCT</span></a>
    <button class="heart" aria-label="Save ${p.name}" onclick="this.classList.toggle('liked')">♡</button>
    <div class="product-info"><a class="product-name" href="product.html?id=${p.id}">${p.name}</a>
      <div class="rating"><span>★★★★★</span> <small>(${p.reviews})</small></div>
      <strong class="price">${money(p.price)}</strong>
      <a class="btn btn-primary card-button" href="product.html?id=${p.id}">VIEW DETAILS</a>
    </div></article>`;
}
function renderCards(target, items) {
  const el = document.getElementById(target);
  if (el) el.innerHTML = items.map(productCard).join("");
}
function renderProductPage() {
  const root = document.getElementById("product-detail");
  if (!root) return;
  const id = new URLSearchParams(location.search).get("id");
  const p = products.find(item => item.id === id) || products[0];
  document.title = `${p.name} — CakeShop`;
  document.getElementById("crumb-name").textContent = p.name;
  const message = `Hello CakeShop! I'm interested in ordering ${p.name} (${money(p.price)}). Please share the details.`;
  root.innerHTML = `<div class="detail-image"><img src="${p.image}" alt="${p.name}"></div>
    <div class="detail-info"><p class="eyebrow">${p.category.toUpperCase()} COLLECTION</p><h1>${p.name}</h1>
      <div class="rating detail-rating"><span>★★★★★</span> <small>${p.rating} (${p.reviews} reviews)</small></div>
      <div class="detail-price">${money(p.price)}</div><p class="detail-description">${p.description}</p>
      <div class="detail-note"><span>♡</span><div><b>Made fresh with care</b><small>Contact us to discuss your preferred size, flavour and design.</small></div></div>
      <a class="btn btn-primary whatsapp-button" href="${whatsappLink(message)}" target="_blank" rel="noopener">☏ &nbsp; ORDER / ASK ON WHATSAPP</a>
      <p class="no-delivery">No online checkout or delivery booking — contact us directly to discuss your order.</p>
      <div class="detail-meta"><span>Category:</span> ${p.category} Cakes</div>
    </div>`;
  renderCards("related-grid", products.filter(x => x.id !== p.id).slice(0,3));
}
document.addEventListener("DOMContentLoaded", () => {
  renderCards("product-grid", products.slice(0,4));
  renderProductPage();
  setWhatsAppLinks();
  document.querySelectorAll(".category").forEach(link => link.addEventListener("click", () => {
    const category = link.dataset.category;
    const matches = products.filter(p => p.category === category || (category === "Photo" && p.category === "Birthday"));
    if (matches.length) {
      const grid = document.getElementById("product-grid");
      if (grid) grid.innerHTML = matches.map(productCard).join("");
    }
  }));
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");
  if (toggle && nav) toggle.addEventListener("click", () => {
    nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", nav.classList.contains("open"));
  });
});

/* ===== Animations (added) ===== */
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("product-grid");
  const io = "IntersectionObserver" in window ? new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.15 }) : null;

  const watch = (selector, pop) => document.querySelectorAll(selector).forEach((el, i) => {
    if (!io) return;
    el.classList.add("reveal");
    if (pop) el.classList.add("pop");
    el.style.setProperty("--d", (i % 5) * 0.05 + "s");
    io.observe(el);
  });

  watch(".section-heading");
  watch(".feature", true);
  watch(".category", true);
  watch(".product-grid .product-card", true);
  watch(".about-section");

  // Cards re-rendered when a category is clicked
  if (grid) new MutationObserver(() => {
    grid.querySelectorAll(".product-card").forEach((c, i) => {
      c.classList.remove("reveal", "pop", "in");
      c.style.setProperty("--d", i * 0.05 + "s");
      c.classList.remove("card-in"); void c.offsetWidth; c.classList.add("card-in");
    });
  }).observe(grid, { childList: true });
});

/* ===== Topbar hide/show on scroll (added) ===== */
(() => {
  let last = window.scrollY, ticking = false;
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      if (y <= 10 || y < last - 4) document.body.classList.remove("topbar-hidden");
      else if (y > 80 && y > last + 4) document.body.classList.add("topbar-hidden");
      last = y;
      ticking = false;
    });
  }, { passive: true });
})();