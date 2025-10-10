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
    const products = [];

    for (const file of files) {
      if (file.name.endsWith(".md")) {
        const rawRes = await fetch(file.download_url);
        if (!rawRes.ok) continue;

        const text = await rawRes.text();
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
    container.innerHTML = products.map(p => {
      const productId = encodeURIComponent(p.title || 'product');
      const productLink = `${window.location.href}#${productId}`;
      const waMessage = `Hi, I'm interested in your MEDZONE SUPPLIES AD: ${productLink} (${p.title || ''} - ${p.price || ''})`;
      const waLink = `https://wa.me/254768675020?text=${encodeURIComponent(waMessage)}`;

      return `
      <div class="product-card" id="${productId}">
        <img src="${p.image || 'placeholder.png'}" alt="${p.title || 'Product'}" class="product-img">
        <h4>${p.title || 'Unnamed Product'}</h4>
        <p>${p.description || ''}</p>
        <span class="price">${p.price || ''}</span>
        <div style="margin-top:10px; display:flex; justify-content:center; gap:10px;">
          <!-- WhatsApp Icon -->
          <a href="${waLink}" target="_blank" style="display:inline-flex; align-items:center; justify-content:center; width:40px; height:40px; border-radius:50%; background:#25D366; color:#fff; text-decoration:none; font-size:20px;">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M12.004 2C6.476 2 2 6.477 2 12.006c0 2.112.547 4.089 1.506 5.796L2 22l4.296-1.502A9.966 9.966 0 0 0 12.004 22C17.532 22 22 17.523 22 12.006 22 6.477 17.532 2 12.004 2zm5.688 14.762c-.241.68-1.414 1.312-1.966 1.394-.518.08-1.16.116-3.056-1.037-2.271-1.348-3.708-3.447-3.825-3.594-.116-.148-1.016-1.228-1.016-2.348s.604-1.74.82-1.976c.213-.236.469-.295.628-.295.16 0 .316.002.454.003.148.002.346-.056.542.423.197.478.666 1.647.724 1.767.06.12.1.26.002.418-.096.158-.145.253-.29.395-.148.145-.314.322-.449.43-.148.122-.3.256-.127.505.173.25.767 1.271 1.642 2.053 1.13.978 2.077 1.299 2.388 1.448.311.148.492.123.672-.075.18-.197.773-.905.977-1.217.203-.312.407-.26.68-.156.274.103 1.731.817 2.03.965.3.148.5.222.57.345.07.122.07.708-.172 1.387z"/>
            </svg>
          </a>

          <!-- Call Icon -->
          <a href="tel:+254768675020" style="disp
          
