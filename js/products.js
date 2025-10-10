// assets/js/product.js

// Target the container where products will appear
const productList = document.getElementById("product-list");

// Helper function: Parse frontmatter (--- ... ---) from Markdown
function parseFrontMatter(mdText) {
  const frontmatterRegex = /^---\n([\s\S]+?)\n---/;
  const match = mdText.match(frontmatterRegex);
  const content = mdText.replace(frontmatterRegex, "").trim();

  if (!match) return { attributes: {}, body: content };

  const lines = match[1].split("\n");
  const attributes = {};

  lines.forEach(line => {
    const [key, ...valueParts] = line.split(":");
    const value = valueParts.join(":").trim().replace(/^"|"$/g, "");
    attributes[key.trim()] = value;
  });

  return { attributes, body: content };
}

// Fetch all .md files dynamically from the "products" folder
async function loadProducts() {
  try {
    const res = await fetch("/products/");
    const html = await res.text();

    // Find markdown file links
    const mdFiles = [...html.matchAll(/href="([^"]+\.md)"/g)].map(m => m[1]);

    if (mdFiles.length === 0) {
      productList.innerHTML = "<p>No products found.</p>";
      return;
    }

    // Load and parse each markdown product file
    const products = await Promise.all(
      mdFiles.map(async file => {
        const resp = await fetch(file);
        const text = await resp.text();
        const { attributes, body } = parseFrontMatter(text);
        attributes.description = attributes.description || body.split("\n")[0];
        return attributes;
      })
    );

    displayProducts(products);
  } catch (err) {
    console.error("Error loading products:", err);
    productList.innerHTML = "<p>Failed to load products.</p>";
  }
}

// Display products on the page
function displayProducts(products) {
  productList.innerHTML = "";

  products.forEach(prod => {
    const card = document.createElement("div");
    card.classList.add("product-card");

    card.innerHTML = `
      <img src="${prod.image || '/assets/images/no-image.png'}" alt="${prod.title || 'Product'}">
      <h3>${prod.title || "Unnamed Product"}</h3>
      <p class="price">${prod.price || ""}</p>
      <p class="desc">${prod.description || ""}</p>
      <a href="https://wa.me/254768675020?text=Hi%20I'm%20interested%20in%20${encodeURIComponent(prod.title || '')}" 
         class="whatsapp-btn" target="_blank">🟢 WhatsApp Us</a>
    `;

    productList.appendChild(card);
  });
}

// Run when the page loads
document.addEventListener("DOMContentLoaded", loadProducts);
