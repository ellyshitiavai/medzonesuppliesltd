const productList = document.getElementById("product-list");
const searchInput = document.getElementById("searchInput");

// Add inline styles
const style = document.createElement("style");
style.textContent = `
  #product-list {
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
    box-shadow: 0 6px 10px rgba(0,0,0,0.15);
  }

  .product-img {
    width: 100%;
    height: 180px;
    object-fit: cover;
    border-radius: 12px;
  }

  .product-card h3 {
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

  #searchInput {
    width: 95%;
    max-width: 400px;
    padding: 10px 12px;
    margin: 15px auto;
    display: block;
    border-radius: 8px;
    border: 1px solid #ccc;
  }
`;
document.head.appendChild(style);

// Load products
async function loadProducts() {
  try {
    const response = await fetch("/products/");
    const text = await response.text();

    // Extract .md filenames
    const files = [...text.matchAll(/href="([^"]+\.md)"/g)].map(m => m[1]);
    if (!files.length) {
      productList.innerHTML = "<p>No products found. Add .md files to the /products/ folder.</p>";
      return;
    }

    const products = [];

    for (const file of files) {
      const res = await fetch(`/products/${file}`);
      const content = await res.text();
      const frontmatter = content.match(/---([\\s\\S]*?)---/);
      if (!frontmatter) continue;

      const fm = frontmatter[1];
      const get = key => {
        const regex = new RegExp(`${key}:\\s*"?([^"\\n]+)"?`);
        const match = fm.match(regex);
        return match ? match[1].trim() : "";
      };

      products.push({
        title: get("title"),
        price: get("price"),
        image: get("image"),
        description: get("description"),
      });
    }

    displayProducts(products);

    // Search filter
    searchInput.addEventListener("input", e => {
      const q = e.target.value.toLowerCase();
      const filtered = products.filter(p =>
        p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
      displayProducts(filtered);
    });

  } catch (err) {
    console.error("Error loading products:", err);
    productList.innerHTML = "<p>⚠️ Failed to load products. Please check your /products/ folder path.</p>";
  }
}

function displayProducts(products) {
  productList.innerHTML = products.map(p => `
    <div class="product-card">
      <img src="${p.image}" alt="${p.title}" class="product-img">
      <h3>${p.title}</h3>
      <p>${p.description}</p>
      <span class="price">Ksh ${p.price}</span>
      <a href="https://wa.me/254768675020?text=Hello%20Medzone%2C%20I'm%20interested%20in%20${encodeURIComponent(p.title)}" target="_blank" class="buy-btn">
        💬 Buy Now
      </a>
    </div>
  `).join("");
}

// Start
loadProducts();
                   
