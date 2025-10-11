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
console.log("✅ products.js inline test running...");

const productList = document.getElementById("product-list");
const loader = document.getElementById("loader");

// Show loader immediately
loader.style.display = "flex";

async function loadProducts() {
  try {
    console.log("🔄 Fetching products...");
    const res = await fetch("https://api.github.com/repos/ellyshitiavai/medzonesuppliesltd/content/products");
    if (!res.ok) throw new Error("Failed to fetch product list");

    const files = await res.json();
    console.log("✅ Product files:", files);

    if (!Array.isArray(files) || files.length === 0) {
      productList.innerHTML = "<p>No products found in repo.</p>";
      return;
    }

    const products = [];

    for (const file of files) {
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

        if (data.title) products.push(data);
        
