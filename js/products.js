// products.js

// ✅ Configuration for your GitHub repo
const githubUser = "ellyshitiavai";
const repoName = "medzonesuppliesltd";
const branch = "main";
const folderPath = "content/products"; // folder containing .md product files

// ✅ Match the <div id="products-container"> in your products.html
const productContainer = document.getElementById("products-container");

// Main function to load product markdown files from GitHub
async function loadProducts() {
  try {
    const apiUrl = `https://api.github.com/repos/${githubUser}/${repoName}/contents/${folderPath}?ref=${branch}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`GitHub API returned ${response.status}`);
    }

    const files = await response.json();
    const mdFiles = files.filter(file => file.name.endsWith(".md"));

    if (mdFiles.length === 0) {
      productContainer.innerHTML = `<p>No products found.</p>`;
      return;
    }

    // Loop through each markdown file and render it
    for (const file of mdFiles) {
      const rawUrl = `https://raw.githubusercontent.com/${githubUser}/${repoName}/${branch}/${folderPath}/${file.name}`;
      const res = await fetch(rawUrl);
      if (!res.ok) {
        console.warn(`❌ Failed to load: ${file.name} (${res.status})`);
        continue;
      }

      const content = await res.text();
      const product = parseMarkdown(content);
      renderProduct(product);
    }
  } catch (err) {
    console.error("⚠️ Error loading products:", err);
    productContainer.innerHTML = `<p class="error">Unable to load products. Check console for details.</p>`;
  }
}

// Parse YAML frontmatter and body content
function parseMarkdown(mdText) {
  const frontmatterMatch = /^---([\s\S]*?)---/.exec(mdText);
  const frontmatter = {};
  let content = mdText;

  if (frontmatterMatch) {
    const yaml = frontmatterMatch[1].trim();
    yaml.split("\n").forEach(line => {
      const [key, ...rest] = line.split(":");
      frontmatter[key.trim()] = rest.join(":").trim().replace(/^"|"$/g, "");
    });
    content = mdText.slice(frontmatterMatch[0].length).trim();
  }

  // ✅ Adjust image path fallback
  const imageUrl =
    frontmatter.image && frontmatter.image.startsWith("http")
      ? frontmatter.image
      : frontmatter.image
      ? `/uploads/${frontmatter.image.replace(/^\/+/, "")}`
      : "https://medzonesupplyltd.netlify.app/uploads/default.png";

  return {
    title: frontmatter.title || "Untitled Product",
    price: frontmatter.price || "Price on request",
    image: imageUrl,
    description: frontmatter.description || content || "",
  };
}

// Render product card on page
function renderProduct(product) {
  const card = document.createElement("div");
  card.className = "product-card";

  card.innerHTML = `
    <img src="${product.image}" alt="${product.title}" class="product-image" onerror="this.src='https://medzonesupplyltd.netlify.app/uploads/default.png'" />
    <h3>${product.title}</h3>
    <p>${product.description}</p>
    <span class="price">${product.price}</span>
  `;

  productContainer.appendChild(card);
}

// Load products after DOM is ready
document.addEventListener("DOMContentLoaded", loadProducts);
