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
    const res = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${folderPath}`);
    if (!res.ok) throw new Error("Failed to fetch product list from GitHub");

    const files = await res.json();
    if (!files.length) throw new Error("No products found in repo");

    const products = [];

    for (const file of files) {
      if (!file.name.endsWith(".md")) continue;

      try {
        const rawRes = await fetch(file.download_url);
        if (!rawRes.ok) {
          console.warn(`Could not fetch file ${file.name}`);
          continue;
        }

        const text = await rawRes.text();
        const data = {};

        // Check for YAML frontmatter block
        const match = text.match(/---([\\s\\S]*?)---/);
        let lines = [];

        if (match) {
          lines = match[1].trim().split("\n");
        } else {
          // fallback: use entire file content as key:value pairs
          lines = text.trim().split("\n");
        }

        lines.forEach(line => {
          const [key, ...rest] = line.split(":");
          if (key && rest.length) {
            data[key.trim()] = rest.join(":").trim().replace(/^"+|"+$/g, "");
          }
        });

        if (data.title) {
          products.push(data);
        } else {
          console.warn(`File ${file.name} has no title, skipping`);
        }
      } catch (e) {
        console.warn(`Failed to load product file ${file.name}:`, e);
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
      const productLink = `${window.location.href}#${productId}`;
      const waMessage = `Hi, I'm interested in your MEDZONE SUPPLIES AD: ${productLink} (${p.title} - ${p.price || ''})`;
      const waLink = `https://wa.me/254768675020?text=${encodeURIComponent(waMessage)}`;

      return `
      <div class="product-card" id="${productId}">
        <img src="${p.image || 'placeholder.png'}" alt="${p.title}" class="product-img">
        <h4>${p.title}</h4>
        <p>${p.description || ''}</p>
        <span class="price">${p.price || ''}</span>
        <div style="margin-top:10px; display:flex; justify-content:center; gap:10px;">
          <a href="${waLink}" target="_blank" style="display:inline-flex; align-items:center; justify-content:center; width:40px; height:40px; border-radius:50%; background:#25D366; color:#fff; text-decoration:none; font-size:20px;">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M12.004 2C6.476 2 2 6.477 2 12.006c0 2.112.547 4.089 1.506 5.796L2 22l4.296-1.502A9.966 9.966 0 0 0 12.004 22C17.532 22 22 17.523 22 12.006 22 6.477 17.532 2 12.004 2zm5.688 14.762c-.241.68-1.414 1.312-1.966 1.394-.518.80…"/>
            </svg>
          </a>
          <a href="tel:+254768675020" style="display:inline-flex; align-items:center; justify-content:center; width:40px; height:40px; border-radius:50%; background:#0c4a6e; color:#fff; text-decoration:none; font-size:20px;">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M6.62 10.79a15.053 15.053 0 006.59 6.…"/>
            </svg>
          </a>
        </div>
      </div>`;
    }).join("");

  } catch (err) {
    console.error("Error loading products:", err);
    loader.style.display = "none";
    noProducts.style.display = "block";
  }
}

loadProducts();
