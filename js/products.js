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

// 🌟 MEDZONE SUPPLIES - All-in-One Products + Hero Slider with Arrows & Dots
alert("Products.js is running!");

const productList = document.getElementById("product-list");
const searchInput = document.getElementById("searchInput");
const heroSlider = document.getElementById("hero-slider");

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

// Styles
const style = document.createElement("style");
style.innerHTML = `
@keyframes spin {0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); }}

.product-card { border:1px solid #ddd; border-radius:12px; padding:12px; background:#fff; box-shadow:0 3px 6px rgba(0,0,0,0.05); cursor:pointer; transition:0.2s; }
.product-card:hover { transform: translateY(-3px); box-shadow:0 6px 10px rgba(0,0,0,0.08); }
.product-card h4 { font-size:16px; color:#0c4a6e; margin:8px 0 4px 0; }
.product-card p { font-size:14px; color:#444; margin:0 0 6px 0; }
.product-card strong { color:#1a73e8; display:block; margin-bottom:8px; }

.carousel { display:flex; overflow-x:auto; scroll-snap-type:x mandatory; gap:8px; border-radius:10px; }
.carousel img { flex:0 0 100%; scroll-snap-align:start; width:100%; height:auto; border-radius:10px; }

.product-buttons { display:flex; justify-content:center; gap:12px; margin-top:8px; }
.product-buttons a { width:42px; height:42px; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#fff; font-size:20px; text-decoration:none; }
.product-buttons a.whatsapp { background:#25D366; }
.product-buttons a.call { background:#0c4a6e; }

.modal { position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.7); display:none; justify-content:center; align-items:center; z-index:1000; }
.modal-content { background:#fff; border-radius:12px; padding:20px; max-width:600px; width:90%; max-height:90%; overflow:auto; position:relative; }
.modal-close { position:absolute; top:10px; right:10px; font-size:22px; font-weight:bold; cursor:pointer; }
.modal-carousel { display:flex; overflow-x:auto; gap:8px; scroll-snap-type:x mandatory; margin-bottom:12px; }
.modal-carousel img { flex:0 0 100%; scroll-snap-align:start; width:100%; height:auto; border-radius:10px; }

.hero-container { display:flex; transition:transform 0.5s ease; position:relative; }
.hero-slide { flex:0 0 100%; position:relative; cursor:pointer; }
.hero-slide img { width:100%; height:auto; border-radius:12px; }
.hero-slide div { position:absolute; bottom:12px; left:12px; color:#fff; background:rgba(0,0,0,0.5); padding:8px; border-radius:6px; }

/* Arrows */
.hero-arrow { position:absolute; top:50%; transform:translateY(-50%); font-size:28px; color:#fff; background:rgba(0,0,0,0.3); border:none; width:40px; height:40px; border-radius:50%; cursor:pointer; display:flex; align-items:center; justify-content:center; z-index:10; }
.hero-arrow.prev { left:10px; }
.hero-arrow.next { right:10px; }

/* Dots */
.hero-dots { position:absolute; bottom:10px; left:50%; transform:translateX(-50%); display:flex; gap:6px; }
.hero-dots span { width:10px; height:10px; border-radius:50%; background:#fff; opacity:0.5; cursor:pointer; transition:0.2s; }
.hero-dots span.active { opacity:1; background:#25D366; }
`;
document.head.appendChild(style);

// GitHub info
const repoOwner = "ellyshitiavai";
const repoName = "medzonesuppliesltd";
const folderPath = "content/products";

// ====== Load Products + Hero Slider ======
async function loadProducts() {
  try {
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

    // ===== Products Listing =====
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

    // ===== Modal =====
    const modal = document.createElement("div");
    modal.className="modal";
    modal.innerHTML = `<div class="modal-content"><span class="modal-close">&times;</span><div class="modal-carousel"></div><h4 id="modal-title"></h4><p id="modal-desc"></p><strong id="modal-price"></strong></div>`;
    document.body.appendChild(modal);

    const modalClose = modal.querySelector(".modal-close");
    modalClose.addEventListener("click",()=>{ modal.style.display="none"; });

    let autoSlideIntervals = [];

    productList.querySelectorAll(".product-card").forEach(card=>{
      card.addEventListener("click",()=>{
        const idx = card.dataset.index;
        const product = products[idx];
        const images = Object.keys(product).filter(k=>k.startsWith("image")).map(k=>product[k]).filter(Boolean);
        const carouselDiv = modal.querySelector(".modal-carousel");
        carouselDiv.innerHTML = images.map(src=>`<img src="${src}" alt="${product.title}">`).join("");
        modal.querySelector("#modal-title").textContent = product.title;
        modal.querySelector("#modal-desc").textContent = product.description||"";
        modal.querySelector("#modal-price").textContent = product.price||"";

        let current = 0;
        clearInterval(autoSlideIntervals[idx]);
        if(images.length>1){
          autoSlideIntervals[idx] = setInterval(()=>{
            current = (current+1)%images.length;
            carouselDiv.scrollTo({ left: carouselDiv.children[current].offsetLeft, behavior:'smooth' });
          },3000);
        }

        modal.style.display="flex";
      });
    });

    modal.addEventListener("click", e => { 
      if(e.target===modal) modal.style.display="none"; 
      autoSlideIntervals.forEach(i=>clearInterval(i));
    });

    // ===== Hero Slider with Arrows & Dots =====
    if(heroSlider){
      const featured = products.slice(0,3);
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

      let currentSlide = 0;
      const container = heroSlider.querySelector(".hero-container");
      const dots = [...heroSlider.querySelectorAll(".hero-dots span")];

      function goToSlide(idx){
        currentSlide = idx;
        container.style.transform = `translateX(-${currentSlide*(100/featured.length)}%)`;
        dots.forEach((d,i)=>d.classList.toggle("active", i===currentSlide));
      }

      // Auto-rotate
      let sliderInterval = setInterval(()=>goToSlide((currentSlide+1)%featured.length),4000);

      // Arrow events
      heroSlider.querySelector(".hero-arrow.prev").addEventListener("click", ()=>{
        goToSlide((currentSlide-1+featured.length)%featured.length);
        clearInterval(sliderInterval); sliderInterval = setInterval(()=>goToSlide((currentSlide+1)%featured.length),4000);
      });
      heroSlider.querySelector(".hero-arrow.next").addEventListener("click", ()=>{
        goToSlide((currentSlide+1)%featured.length);
        clearInterval(sliderInterval); sliderInterval = setInterval(()=>goToSlide((currentSlide+1)%featured.length),4000);
      });

      // Dot events
      dots.forEach((dot,i)=>dot.addEventListener("click",()=>{ goToSlide(i); clearInterval(sliderInterval); sliderInterval = setInterval(()=>goToSlide((currentSlide+1)%featured.length),4000); }));

      // Click hero → open modal
      heroSlider.querySelectorAll(".hero-slide").forEach((slide,idx)=>{
        slide.addEventListener("click",()=> {
          document.querySelector(`.product-card[data-index="${idx}"]`)?.click();
        });
      });
    }

    console.log("🎉 All products + hero slider with arrows & dots loaded successfully");

  } catch(err){
    console.error("💥 Error loading products or hero slider:", err);
    productList.innerHTML="<p>Failed to load products.</p>";
  }
}

// Search
searchInput?.addEventListener("input",e=>{
  const query = e.target.value.toLowerCase();
  document.querySelectorAll(".product-card").forEach(card=>{
    card.style.display=card.textContent.toLowerCase().includes(query)?"block":"none";
  });
});

// Initialize
loadProducts();
                          

