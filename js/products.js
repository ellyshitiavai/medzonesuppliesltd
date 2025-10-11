// Elements
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
loadProducts();

