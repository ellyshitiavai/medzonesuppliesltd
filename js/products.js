/*// Elements
const productList = document.getElementById("product-list");
const searchInput = document.getElementById("searchInput");

// Show mobile-friendly loader
productList.innerHTML = `
  <div id="loader" style="text-align:center; padding:20px;">
    <div style="
      border: 4px solid #f3f3f3;
      border-top: 4px solid #25D366;
      border-radius: 50%;
      width: 30px;
      height: 30px;
      animation: spin 1s linear infinite;
      margin:auto;
    "></div>
    <p style="font-size:14px; color:#555; margin-top:8px;">Loading products...</p>
  </div>
`;

// Spinner animation
const style = document.createElement("style");
style.innerHTML = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;
document.head.appendChild(style);

// GitHub repo info
const repoOwner = "ellyshitiavai";
const repoName = "medzonesuppliesltd";
const folderPath = "content/products"; // ✅ Only one content

// Load products from GitHub
async function loadProducts() {
  try {
    console.log("🔄 Fetching products from GitHub...");
    const res = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${folderPath}`);
    console.log("📦 Response status:", res.status);

    if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);

    const files = await res.json();
    console.log("📁 Files found:", files);

    if (!files.length) {
      productList.innerHTML = "<p>No products found in CMS folder.</p>";
      return;
    }

    const products = [];

    for (const file of files) {
      if (file.name.endsWith(".md")) {
        const raw = await fetch(file.download_url);
        const text = await raw.text();

        // Extract frontmatter
        const match = text.match(/---([\s\S]*?)---/);
        const data = {};
        if (match) {
          match[1].trim().split("\n").forEach(line => {
            const [key, ...rest] = line.split(":");
            if (key) data[key.trim()] = rest.join(":").trim().replace(/"/g, "");
          });
        }

        if (data.title) products.push(data);
      }
    }

    // Remove loader
    const loader = document.getElementById("loader");
    if (loader) loader.remove();

    if (!products.length) {
      productList.innerHTML = "<p>No valid products found.</p>";
      return;
    }

    // Display products
    productList.innerHTML = products.map(p => {
      const productLink = `${window.location.href}#${encodeURIComponent(p.title)}`;
      const waMessage = `Hi, I'm interested in your MEDZONE SUPPLIES AD: ${productLink} (${p.title} - ${p.price || ''})`;
      const waLink = `https://wa.me/254768675020?text=${encodeURIComponent(waMessage)}`;

      return `
        <div class="product-card" style="border:1px solid #ccc; padding:10px; border-radius:8px; text-align:center;">
          <img src="${p.image || 'placeholder.png'}" alt="${p.title}" style="max-width:100%; border-radius:8px;">
          <h4>${p.title}</h4>
          <p>${p.description || ''}</p>
          <strong>${p.price || ''}</strong>
          <div style="margin-top:10px; display:flex; justify-content:center; gap:10px;">
            <a href="${waLink}" target="_blank" style="display:inline-flex; align-items:center; justify-content:center; width:40px; height:40px; border-radius:50%; background:#25D366; color:#fff; text-decoration:none; font-size:20px;">
              <i class="fab fa-whatsapp"></i>
            </a>
            <a href="tel:+254768675020" style="display:inline-flex; align-items:center; justify-content:center; width:40px; height:40px; border-radius:50%; background:#0c4a6e; color:#fff; text-decoration:none; font-size:20px;">
              <i class="fas fa-phone"></i>
            </a>
          </div>
        </div>
      `;
    }).join('');

    console.log("🎉 Products loaded successfully");

  } catch (err) {
    console.error("💥 Error loading products:", err);
    productList.innerHTML = "<p>Failed to load products.</p>";
  }
}

// Search functionality
searchInput?.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();
  document.querySelectorAll(".product-card").forEach(card => {
    const match = card.textContent.toLowerCase().includes(query);
    card.style.display = match ? "block" : "none";
  });
});

// Start loading products
loadProducts();*/

/*// 🌟 MEDZONE SUPPLIES - Unified Script
alert("Products.js is running!");

// Grab elements if they exist
const productList = document.getElementById("product-list");
const searchInput = document.getElementById("searchInput");
const heroSlider = document.getElementById("hero-slider");

// 🧩 Detect which section exists and run the right function
if (heroSlider) {
  loadHeroSlider();   // Run only on home page
} 
if (productList) {
  loadProducts();     // Run only on products page
}

// ==============================
// 🖼️ Hero Slider Function
// ==============================
async function loadHeroSlider() {
  try {
    // Fetch products for the slider
    const repoOwner = "ellyshitiavai";
    const repoName = "medzonesuppliesltd";
    const folderPath = "content/products";

    const res = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${folderPath}`);
    if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
    const files = await res.json();
    if (!files.length) {
      heroSlider.innerHTML = "<p>No featured products found.</p>";
      return;
    }

    // Take first 3 products for hero slider
    const products = [];
    for (const file of files) {
      if (file.name.endsWith(".md")) {
        const raw = await fetch(file.download_url);
        const text = await raw.text();
        const match = text.match(/---([\s\S]*?)---/);
        const data = {};
        if (match) {
          match[1].trim().split("\n").forEach(line=>{
            const [key,...rest]=line.split(":");
            if(key) data[key.trim()]=rest.join(":").trim().replace(/"/g,"");
          });
        }
        if(data.title) products.push(data);
      }
    }

    const featured = products.slice(0,3);
    if (!featured.length) {
      heroSlider.innerHTML = "<p>No featured products found.</p>";
      return;
    }

    // Render slider
    heroSlider.innerHTML = `
      <div class="hero-container">
        ${featured.map(p=>{
          const img = Object.keys(p).find(k=>k.startsWith("image")) ? p[Object.keys(p).find(k=>k.startsWith("image"))] : "placeholder.png";
          return `
            <div class="hero-slide">
              <img src="${img}" alt="${p.title}">
              <div>
                <h3 style="margin:0;">${p.title}</h3>
                <strong>${p.price||""}</strong>
              </div>
            </div>
          `;
        }).join('')}
      </div>
      <button class="hero-arrow prev">&#10094;</button>
      <button class="hero-arrow next">&#10095;</button>
      <div class="hero-dots">
        ${featured.map((_,i)=>`<span class="${i===0?'active':''}"></span>`).join('')}
      </div>
    `;

    // Slider functionality
    let currentSlide = 0;
    const container = heroSlider.querySelector(".hero-container");
    const dots = [...heroSlider.querySelectorAll(".hero-dots span")];

    function goToSlide(idx){
      currentSlide = idx;
      container.style.transform = `translateX(-${currentSlide*(100/featured.length)}%)`;
      dots.forEach((d,i)=>d.classList.toggle("active", i===currentSlide));
    }

    let sliderInterval = setInterval(()=>goToSlide((currentSlide+1)%featured.length),4000);

    heroSlider.querySelector(".hero-arrow.prev").addEventListener("click", ()=>{
      goToSlide((currentSlide-1+featured.length)%featured.length);
      clearInterval(sliderInterval);
      sliderInterval = setInterval(()=>goToSlide((currentSlide+1)%featured.length),4000);
    });
    heroSlider.querySelector(".hero-arrow.next").addEventListener("click", ()=>{
      goToSlide((currentSlide+1)%featured.length);
      clearInterval(sliderInterval);
      sliderInterval = setInterval(()=>goToSlide((currentSlide+1)%featured.length),4000);
    });

    dots.forEach((dot,i)=>dot.addEventListener("click",()=>{
      goToSlide(i);
      clearInterval(sliderInterval);
      sliderInterval = setInterval(()=>goToSlide((currentSlide+1)%featured.length),4000);
    }));

    // Click hero → open modal (if product exists)
    heroSlider.querySelectorAll(".hero-slide").forEach((slide,idx)=>{
      slide.addEventListener("click",()=> {
        document.querySelector(`.product-card[data-index="${idx}"]`)?.click();
      });
    });

    console.log("🎉 Hero slider loaded successfully");
  } catch (err) {
    console.error("💥 Hero slider failed to load:", err);
  }
}

// ==============================
// 📦 Products Function
// ==============================
async function loadProducts() {
  alert("✅ Products Page Script Running");

  // Loader
  productList.innerHTML = `
    <div id="loader" style="text-align:center; padding:30px;">
      <div style="
        border: 4px solid #f3f3f3;
        border-top: 4px solid #25D366;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
        margin:auto;
      "></div>
      <p style="font-size:14px; color:#555; margin-top:10px;">Loading products...</p>
    </div>
  `;

  // Spinner animation
  const style = document.createElement("style");
  style.innerHTML = `
    @keyframes spin {0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); }}
  `;
  document.head.appendChild(style);

  try {
    const repoOwner = "ellyshitiavai";
    const repoName = "medzonesuppliesltd";
    const folderPath = "content/products";

    const res = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${folderPath}`);
    if(!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
    const files = await res.json();
    if(!files.length){ productList.innerHTML="<p>No products found.</p>"; return; }

    const products = [];
    for(const file of files){
      if(file.name.endsWith(".md")){
        const raw = await fetch(file.download_url);
        const text = await raw.text();
        const match = text.match(/---([\s\S]*?)---/);
        const data = {};
        if(match){
          match[1].trim().split("\n").forEach(line=>{
            const [key,...rest]=line.split(":");
            if(key) data[key.trim()] = rest.join(":").trim().replace(/"/g,"");
          });
        }
        if(data.title) products.push(data);
      }
    }

    document.getElementById("loader")?.remove();

    // Render products
    productList.innerHTML = products.map((p,index)=>{
      const images = Object.keys(p).filter(k=>k.startsWith("image")).map(k=>p[k]).filter(Boolean);
      const imageGallery = images.length ? `<div class="carousel" id="carousel-${index}">${images.map(src=>`<img src="${src}" alt="${p.title}">`).join("")}</div>` : `<img src="placeholder.png" alt="${p.title}" style="width:100%; border-radius:10px;">`;

      const productLink = `${window.location.origin}/products#${encodeURIComponent(p.title)}`;
      const waMessage = `Hi, I'm interested in your MEDZONE SUPPLIES AD: ${productLink} (${p.title} - ${p.price||""})`;
      const waLink = `https://wa.me/254768675020?text=${encodeURIComponent(waMessage)}`;

      return `
        <div class="product-card" data-index="${index}">
          ${imageGallery}
          <h4>${p.title}</h4>
          <p>${p.description||""}</p>
          <strong>${p.price||""}</strong>
          <div class="product-buttons">
            <a href="${waLink}" target="_blank" class="whatsapp"><i class="fab fa-whatsapp"></i></a>
            <a href="tel:+254768675020" class="call"><i class="fas fa-phone"></i></a>
          </div>
        </div>
      `;
    }).join("");

    console.log("🎉 Products loaded successfully");

  } catch(err){
    console.error("💥 Error loading products:", err);
    productList.innerHTML="<p>Failed to load products.</p>";
  }
}

// Optional: Search filter
searchInput?.addEventListener("input",e=>{
  const query = e.target.value.toLowerCase();
  document.querySelectorAll(".product-card").forEach(card=>{
    card.style.display = card.textContent.toLowerCase().includes(query)?"block":"none";
  });
});*/

// Elements
const productList = document.getElementById("product-list");
const searchInput = document.getElementById("searchInput");

// Spinner loader
productList.innerHTML = `
  <div id="loader" style="text-align:center; padding:20px;">
    <div style="
      border: 4px solid #f3f3f3;
      border-top: 4px solid #25D366;
      border-radius: 50%;
      width: 30px;
      height: 30px;
      animation: spin 1s linear infinite;
      margin:auto;
    "></div>
    <p style="font-size:14px; color:#555; margin-top:8px;">Loading products...</p>
  </div>
`;

// Spinner animation
const style = document.createElement("style");
style.innerHTML = `
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
.carousel { position: relative; overflow: hidden; border-radius:10px; }
.carousel img { width: 100%; display: none; border-radius:10px; }
.carousel img.active { display: block; }
.carousel-controls { display:flex; justify-content:space-between; position:absolute; top:50%; width:100%; transform:translateY(-50%); padding:0 5px; box-sizing:border-box; }
.carousel-controls span { background:#25D366; color:#fff; padding:5px 10px; border-radius:50%; cursor:pointer; user-select:none; }
`;
document.head.appendChild(style);

// GitHub repo info
const repoOwner = "ellyshitiavai";
const repoName = "medzonesuppliesltd";
const folderPath = "content/products";

// Load products from GitHub
async function loadProducts() {
  try {
    const res = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${folderPath}`);
    if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
    const files = await res.json();
    if (!files.length) {
      productList.innerHTML = "<p>No products found.</p>";
      return;
    }

    const products = [];

    for (const file of files) {
      if (file.name.endsWith(".md")) {
        const raw = await fetch(file.download_url);
        const text = await raw.text();

        // Extract frontmatter
        const match = text.match(/---([\s\S]*?)---/);
        const data = {};
        if (match) {
          match[1].trim().split("\n").forEach(line => {
            const [key, ...rest] = line.split(":");
            if (key) {
              let value = rest.join(":").trim().replace(/"/g, "");
              // Handle array values
              if (value.startsWith("-")) {
                const arr = match[1].trim().split("\n").filter(l => l.startsWith("-")).map(l => l.replace(/^-/, "").trim());
                data[key.trim()] = arr;
              } else data[key.trim()] = value;
            }
          });
        }
        if (data.title) products.push(data);
      }
    }

    // Remove loader
    document.getElementById("loader")?.remove();

    // Render products
    productList.innerHTML = products.map((p, index) => {
      const images = p.images && p.images.length ? p.images : ["placeholder.png"];
      const carouselImages = images.map((img, i) => `<img src="${img}" alt="${p.title}" class="${i===0?'active':''}">`).join("");
      const productLink = `${window.location.origin}/products#${encodeURIComponent(p.title)}`;
      const waMessage = `Hi, I'm interested in your MEDZONE SUPPLIES AD: ${productLink} (${p.title} - ${p.price||""})`;
      const waLink = `https://wa.me/254768675020?text=${encodeURIComponent(waMessage)}`;

      return `
        <div class="product-card" data-index="${index}" style="border:1px solid #ccc; padding:10px; border-radius:8px; text-align:center;">
          <div class="carousel" id="carousel-${index}">
            ${carouselImages}
            <div class="carousel-controls">
              <span class="prev">&#10094;</span>
              <span class="next">&#10095;</span>
            </div>
          </div>
          <h4>${p.title}</h4>
          <p>${p.description||""}</p>
          <strong>${p.price||""}</strong>
          <div style="margin-top:10px; display:flex; justify-content:center; gap:10px;">
            <a href="${waLink}" target="_blank" style="display:inline-flex; align-items:center; justify-content:center; width:40px; height:40px; border-radius:50%; background:#25D366; color:#fff; text-decoration:none; font-size:20px;">
              <i class="fab fa-whatsapp"></i>
            </a>
            <a href="tel:+254768675020" style="display:inline-flex; align-items:center; justify-content:center; width:40px; height:40px; border-radius:50%; background:#0c4a6e; color:#fff; text-decoration:none; font-size:20px;">
              <i class="fas fa-phone"></i>
            </a>
          </div>
        </div>
      `;
    }).join("");

    // Initialize carousel
    products.forEach((_, index) => {
      const carousel = document.getElementById(`carousel-${index}`);
      if (!carousel) return;
      const imgs = carousel.querySelectorAll("img");
      let current = 0;
      const show = i => imgs.forEach((img, idx) => img.classList.toggle("active", idx === i));
      carousel.querySelector(".prev").addEventListener("click", () => { current = (current-1+imgs.length)%imgs.length; show(current); });
      carousel.querySelector(".next").addEventListener("click", () => { current = (current+1)%imgs.length; show(current); });
    });

    console.log("🎉 Products loaded with gallery successfully!");

  } catch (err) {
    console.error("💥 Error loading products:", err);
    productList.innerHTML = "<p>Failed to load products.</p>";
  }
}

// Search filter
searchInput?.addEventListener("input", e => {
  const query = e.target.value.toLowerCase();
  document.querySelectorAll(".product-card").forEach(card => {
    card.style.display = card.textContent.toLowerCase().includes(query) ? "block" : "none";
  });
});

// Start
loadProducts();

