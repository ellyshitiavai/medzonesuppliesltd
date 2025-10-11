// === GitHub Repo Info ===
const repoOwner = "ellyshitiavai";
const repoName = "medzonesuppliesltd";
const folderPath = "content/products";

// === Page Elements ===
const container = document.getElementById("products");
const loader = document.getElementById("loader");
const noProducts = document.getElementById("no-products");

// Initialize display states
container.style.display = "none";
noProducts.style.display = "none";
loader.style.display = "flex";
loader.innerHTML = `
  <div style="
    width:100%;
    display:flex;
    justify-content:center;
    align-items:center;
    flex-direction:column;
    gap:10px;
    padding:40px 0;
  ">
    <div class="spinner" style="
      border: 5px solid #f3f3f3;
      border-top: 5px solid #0c4a6e;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
    "></div>
    <p style="color:#0c4a6e;font-weight:500;">Loading products...</p>
  </div>
`;

// Add basic spin animation via JS
const style = document.createElement('style');
style.innerHTML = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`;
document.head.appendChild(style);

// === Load Products Function ===
async function loadProducts() {
  try {
    console.log("Fetching product list from GitHub...");
    const res = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${folderPath}`);
    if (!res.ok) throw new Error("Failed to fetch product list from GitHub");

    const files = await res.json();
    if (!files.length) throw new Error("No products found in repo");

    const products = [];

    for (const file of files) {
      if (!file.name.endsWith(".md")) continue;

      try {
        const rawRes = await fetch(file.download_url);
        if (!rawRes.ok) {
          console.warn(`Could not fetch file ${file.name}`);
          continue;
        }

        const text = await rawRes.text();
        const data = {};

        // Detect YAML frontmatter or fallback plain key:value
        const match = text.match(/---([\s\S]*?)---/);
        let lines = match ? match[1].trim().split("\n") : text.trim().split("\n");

        lines.forEach(line => {
          const [key, ...rest] = line.split(":");
          if (key && rest.length) {
            data[key.trim()] = rest.join(":").trim().replace(/^"+|"+$/g, "");
          }
        });

        if (data.title) {
          products.push(data);
        } else {
          console.warn(`File ${file.name} has no title, skipping`);
        }
      } catch (e) {
        console.warn(`Failed to load product file ${file.name}:`, e);
      }
    }

    loader.style.display = "none";

    if (!products.length) {
      noProducts.style.display = "block";
      noProducts.innerHTML = `
        <p style="color:#666;text-align:center;margin:40px 0;">
          No products found. Please check your CMS or GitHub folder.
        </p>`;
      return;
    }

    // === Render Products ===
    container.style.display = "grid";
    container.innerHTML = products.map(p => {
      const productId = encodeURIComponent(p.title);
      const productLink = `${window.location.href}#${productId}`;
      const waMessage = `Hi, I'm interested in your MEDZONE SUPPLIES AD: ${productLink} (${p.title} - ${p.price || ''})`;
      const waLink = `https://wa.me/254768675020?text=${encodeURIComponent(waMessage)}`;

      return `
      <div class="product-card" id="${productId}" style="
        background:#fff;
        border-radius:12px;
        box-shadow:0 2px 6px rgba(0,0,0,0.1);
        padding:15px;
        text-align:center;
        transition:transform 0.2s;
      ">
        <img src="${p.image || 'placeholder.png'}" alt="${p.title}" class="product-img" style="
          width:100%;
          height:180px;
          object-fit:cover;
          border-radius:10px;
        ">
        <h4 style="margin:10px 0;font-size:18px;color:#0c4a6e;">${p.title}</h4>
        <p style="font-size:14px;color:#555;">${p.description || ''}</p>
        <span class="price" style="color:#25D366;font-weight:600;">${p.price || ''}</span>
        <div style="margin-top:10px; display:flex; justify-content:center; gap:10px;">
          <!-- WhatsApp Icon -->
          <a href="${waLink}" target="_blank" style="
            display:inline-flex;
            align-items:center;
            justify-content:center;
            width:40px;
            height:40px;
            border-radius:50%;
            background:#25D366;
            color:#fff;
            text-decoration:none;
            font-size:20px;">
            <i class="fa-brands fa-whatsapp"></i>
          </a>

          <!-- Call Icon -->
          <a href="tel:+254768675020" style="
            display:inline-flex;
            align-items:center;
            justify-content:center;
            width:40px;
            height:40px;
            border-radius:50%;
            background:#0c4a6e;
            color:#fff;
            text-decoration:none;
            font-size:20px;">
            <i class="fa-solid fa-phone"></i>
          </a>
        </div>
      </div>`;
    }).join("");

  } catch (err) {
    console.error("Error loading products:", err);
    loader.style.display = "none";
    noProducts.style.display = "block";
    noProducts.innerHTML = `
      <p style="color:red;text-align:center;margin:40px 0;">
        ⚠️ Error loading products. Check console for details.
      </p>`;
  }
}

// === Run Loader ===
loadProducts();
