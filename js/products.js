async function loadProducts() {
  const container = document.getElementById('products-container');
  if (!container) {
    console.error("No #products-container element found");
    return;
  }

  try {
    // GitHub API to list your markdown files in the products folder
    const res = await fetch('https://api.github.com/repos/ellyshitiavai/medzonesuppliesltd/contents/content/products');
    const files = await res.json();
    const mdFiles = files.filter(f => f.name.endsWith('.md'));

    const products = [];
    for (const f of mdFiles) {
      const r = await fetch(f.download_url);
      const text = await r.text();
      const fm = frontMatter(text);
      products.push({
        ...fm.attributes,
        content: marked.parse(fm.body)
      });
    }

    container.innerHTML = products.map(p => `
      <div class="product">
        <h2>${p.title}</h2>
        <p><strong>Price:</strong> ${p.price || ''}</p>
        <div class="images">
          ${(p.images || []).map(img => `<img src="${img}" alt="${p.title}" width="150">`).join('')}
        </div>
        <div>${p.content}</div>
      </div>
    `).join('');

  } catch (err) {
    console.error(err);
    container.innerHTML = '⚠️ Failed to load products.';
  }
}

loadProducts();
