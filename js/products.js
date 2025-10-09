// products.js

// ✅ Configuration for your GitHub repo
const githubUser = "ellyshitiavai";
const repoName = "medzonesuppliesltd";
const branch = "main";
const folderPath = "products"; // Folder where CMS saves product .md files

const productContainer = document.getElementById("product-list");

// Function to load all product markdown files from GitHub
async function loadProducts() {
  try {
    const apiUrl = `https://api.github.com/repos/${githubUser}/${repoName}/contents/${folderPath}?ref=${branch}`;
    const response = await fetch(apiUrl);
    const files = await response.json();

    const mdFiles = files.filter(file => file.name.endsWith(".md"));

    for (const file of mdFiles) {
      const rawUrl = `https://raw.githubusercontent.com/${githubUser}/${repoName}/${branch}/${folderPath}/${file.name}`;
      const content = await fetch(rawUrl).then(res => res.text());
      const product = parseMarkdown(content);
      renderProduct(product);
    }
  } catch (err) {
    console.error("Error loading products:", err);
    productContainer.innerHTML = `<p class="error">Unable to load products. Check console for details.</p>`;
  }
}

// Parse Markdown frontmatter (YAML block at the top of .md files)
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

  return {
    title: frontmatter.title || "Untitled Product",
    price: frontmatter.price || "Price on request",
    image: frontmatter.image || "/uploads/default.png",
    description: frontmatter.description || content || "",
  };
}

// Render product card to the page
function renderProduct(product) {
  const card = document.createElement("div");
  card.className = "product-card";

  card.innerHTML = `
    <img src="${product.image}" alt="${product.title}" class="product-image" />
    <h3>${product.title}</h3>
    <p>${product.description}</p>
    <span class="price">${product.price}</span>
  `;

  productContainer.appendChild(card);
}

// Start loading products when page loads
document.addEventListener("DOMContentLoaded", loadProducts);
