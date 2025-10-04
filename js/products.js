// GitHub repo details
const repoOwner = "ellyshitiavai";
const repoName = "medzonesuppliesltd";
const folderPath = "content/products"; // where .md files are stored

const container = document.getElementById("products");

// 🌀 Show loading message
container.innerHTML = `
  <div class="loading">
    <div class="spinner"></div>
    <p>Loading products...</p>
  </div>
`;

async function loadProducts() {
  try {
    // Fetch file list from GitHub
    const res = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${folderPath}`);
    if (!res.ok) throw new Error("Failed to load product list");
    
    const files = await res.json();
    const products = [];

    for (const file of files) {
      if (file.name.endsWith(".md")) {
        const raw = await fetch(file.download_url);
        const text = await raw.text();

        // Extract YAML frontmatter
        const match = text.match(/---([\s\S]*?)---/);
        if (!match) continue;

        const yaml = match[1].trim().split("\n");
        const data = {};

        yaml.forEach(line => {
          const [key, ...rest] = line.split(":");
          if (key && rest.length) {
            data[key.trim()] = rest.join(":").trim().replace(/"/g, "");
          }
        });

        products.push(data);
      }
    }

    // If no products found
    if (products.length === 0) {
      container.innerHTML = `
        <div class="no-products">
          <p>No products found yet. Check back soon!</p>
        </div>
      `;
      return;
    }

    // 🧱 Display products
    container.innerHTML = products.map(p => `
      <div class="product">
        <img src="${p.image || '/assets/images/placeholder.png'}" alt="${p.title || 'Product'}" class="product-img">
        <h3>${p.title || 'Unnamed Product'}</h3>
        <p>${p.description || ''}</p>
        <span class="price">${p.price || ''}</span>
      </div>
    `).join('');

  } catch (err) {
    console.error("Error loading products:", err);
    container.innerHTML = `
      <div class="error">
        <p>⚠️ Failed to load products. Please refresh or try again later.</p>
      </div>
    `;
  }
}

loadProducts();
