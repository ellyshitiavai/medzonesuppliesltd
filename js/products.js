// GitHub repo info
const repoOwner = "ellyshitiavai";
const repoName = "medzonesuppliesltd";
const folderPath = "content/products";  // matches your repo

const container = document.getElementById("products");
const loader = document.getElementById("loader");
const noProducts = document.getElementById("no-products");

container.style.display = "none";

// Add inline styles for product cards
const style = document.createElement("style");
style.textContent = `
  #products {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 16px;
    padding: 10px;
  }

  .product-card {
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 3px 6px rgba(0,0,0,0.1);
    overflow: hidden;
    text-align: center;
    padding: 15px;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .product-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 12px rgba(0,0,0,0.15);
  }

  .product-img {
    width: 100%;
    height: 180px;
    object-fit: cover;
    border-radius: 12px;
  }

  .product-card h4 {
    margin: 10px 0 5px;
    font-size: 1.1rem;
  }

  .product-card p {
    font-size: 0.9rem;
    color: #555;
  }

  .price {
    display: block;
    margin-top: 6px;
    font-weight: bold;
    color: #198754;
    font-size: 1rem;
  }

  .buy-btn {
    background: #25D366;
    color: white;
    padding: 8px 12px;
    border-radius: 8px;
    text-decoration: none;
    display: inline-block;
    margin-top: 8px;
    font-weight: 600;
    transition: background 0.2s;
  }

  .buy-btn:hover {
    background: #1ebd5a;
  }
`;
document.head.appendChild(style);

// Load products from GitHub
async function loadProducts() {
  try {
    const res = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${folderPath}`);
    if (!res.ok) throw new Error("Failed to fetch product list from GitHub");

    const files = await res.json();
    if (!files.length) throw new Error("No products found in repo");

    const products = [];

    for (const file of files) {
      if (file.name.endsWith(".md")) {
        try {
          const rawRes = await fetch(file.download_url);
          if (!rawRes.ok) continue;

          const text = await rawRes.text();
          const match = text.match(/---([\s\S]*?)---/);
          const data = {};

          if (match) {
            const yaml = match[1].trim().split("\n");
            yaml.forEach(line => {
              const [key, ...rest] = line.split(":");
              if (key) data[key.trim()] = rest.join(":").trim().replace(/"/g, "");
            });
          }

          if (data.title) products.push(data);

        } catch (e) {
          console.warn(`Failed to load product file ${file.name}:`, e);
        }
      }
    }

    loader.style.display = "none";

    if (!products.length) {
      noProducts.style.display = "block";
      return;
    }

    container.style.display = "grid";
    container.innerHTML = products.map(p => {
      const productId = encodeURIComponent(p.title);
      const waMessage = `Hi, I'm interested in your MEDZONE SUPPLIES AD: ${p.title} (${p.price || ''})`;
      const waLink = `https://wa.me/254768675020?text=${encodeURIComponent(waMessage)}`;

      return `
        <div class="product-card" id="${productId}">
          <img src="${p.image || 'placeholder.png'}" alt="${p.title}" class="product-img">
          <h4>${p.title}</h4>
          <p>${p.description || ''}</p>
          <span class="price">${p.price || ''}</span>
          <a href="${waLink}" target="_blank" class="buy-btn">💬 WhatsApp</a>
        </div>`;
    }).join('');

  } catch (err) {
    console.error("Error loading products:", err);
    loader.style.display = "none";
    noProducts.style.display = "block";
  }
}

// Initialize
loadProducts();
