// GitHub repo info
const repoOwner = "ellyshitiavai";
const repoName = "medzonesuppliesltd";
const folderPath = "content/products";

const container = document.getElementById("products");
const loader = document.getElementById("loader");
const noProducts = document.getElementById("no-products");

container.style.display = "none";

async function loadProducts() {
  try {
    // Fetch list of files in products folder
    const res = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${folderPath}`);
    if (!res.ok) throw new Error("Failed to fetch product list from GitHub");

    const files = await res.json();
    const products = [];

    for (const file of files) {
      if (file.name.endsWith(".md")) {
        const rawRes = await fetch(file.download_url);
        if (!rawRes.ok) continue;

        const text = await rawRes.text();

        // Extract YAML frontmatter
        const match = text.match(/---([\s\S]*?)---/);
        if (!match) continue;

        const yaml = match[1].trim().split("\n");
        const data = {};
        yaml.forEach(line => {
          const [key, ...rest] = line.split(":");
          if (key && rest.length) data[key.trim()] = rest.join(":").trim().replace(/"/g, "");
        });

        products.push(data);
      }
    }

    loader.style.display = "none";

    if (products.length === 0) {
      noProducts.style.display = "block";
      return;
    }

    container.style.display = "grid";
    container.innerHTML = products.map(p => `
      <div class="product-card">
        <img src="${p.image || 'placeholder.png'}" alt="${p.title || 'Product'}" class="product-img">
        <h4>${p.title || 'Unnamed Product'}</h4>
        <p>${p.description || ''}</p>
        <span class="price">${p.price || ''}</span>
        <a href="#" class="btn">View Product</a>
      </div>
    `).join('');

  } catch (err) {
    console.error("Error loading products:", err);
    loader.style.display = "none";
    noProducts.style.display = "block";
  }
}

// Load products on page ready
loadProducts();
