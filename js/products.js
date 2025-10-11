<div id="product-list" style="text-align:center; padding:40px;">
  <div id="loader" style="display:flex; flex-direction:column; align-items:center; justify-content:center;">
    <div class="spinner" style="
      border: 5px solid #f3f3f3;
      border-top: 5px solid #3498db;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
    "></div>
    <p style="margin-top:10px;">Loading products...</p>
  </div>
</div>

<style>
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>

<script>
console.log("✅ Script started");

// Select elements
const productList = document.getElementById("product-list");
const loader = document.getElementById("loader");

// Show loader
loader.style.display = "flex";

async function loadProducts() {
  try {
    console.log("🔄 Fetching from GitHub API...");
    const res = await fetch("https://api.github.com/repos/ellyshitiavai/medzonesuppliesltd/contents/content/products");

    console.log("📦 Response status:", res.status);

    if (!res.ok) throw new Error("❌ Failed to fetch product list");

    const files = await res.json();
    console.log("📁 Files found:", files);

    if (!Array.isArray(files) || files.length === 0) {
      productList.innerHTML = "<p>No products found in repo folder.</p>";
      return;
    }

    const products = [];

    for (const file of files) {
      console.log("🧾 Checking file:", file.name);
      if (file.name.endsWith(".md")) {
        const raw = await fetch(file.download_url);
        const text = await raw.text();
        const match = text.match(/---([\s\S]*?)---/);
        const data = {};

        if (match) {
          match[1].trim().split("\n").forEach(line => {
            const [key, ...rest] = line.split(":");
            data[key.trim()] = rest.join(":").trim().replace(/"/g, "");
          });
        }

        if (data.title) {
          console.log("✅ Product parsed:", data.title);
          products.push(data);
        }
      }
    }

    loader.style.display = "none";

    if (!products.length) {
      console.warn("⚠️ No valid product entries found in markdown files");
      productList.innerHTML = "<p>No valid products found.</p>";
      return;
    }

    productList.innerHTML = products.map(p => `
      <div style="border:1px solid #ccc; padding:10px; margin:10px; border-radius:8px;">
        <img src="${p.image || 'placeholder.png'}" alt="${p.title}" style="max-width:100%; border-radius:8px;">
        <h4>${p.title}</h4>
        <p>${p.description || ''}</p>
        <strong>${p.price || ''}</strong>
      </div>
    `).join('');

    console.log("🎉 Products displayed successfully");

  } catch (err) {
    console.error("💥 Error loading products:", err);
    loader.style.display = "none";
    productList.innerHTML = "<p>Failed to load products.</p>";
  }
}

loadProducts();
</script>
      
