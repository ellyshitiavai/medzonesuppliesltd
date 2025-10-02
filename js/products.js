async function loadProducts() {
  const container = document.getElementById('products-container');

  try {
    // List of product markdown files (manually list or generate)
    const files = [
      '/content/products/fetal-doppler.md',
      '/content/products/enema-kit.md'
      // Add more here as you add products
    ];

    const products = [];

    for (const file of files) {
      const res = await fetch(file);
      const text = await res.text();
      const fm = frontMatter(text);
      products.push({
        ...fm.attributes,
        content: marked.parse(fm.body)
      });
    }

    container.innerHTML = products.map(p => `
      <div class="product">
        <h2>${p.title}</h2>
        <p><strong>Price:</strong> $${p.price}</p>
        <div class="images">
          ${(p.images || []).map(img => `<img src="${img}" alt="${p.title}" width="150">`).join('')}
        </div>
        <div>${p.content}</div>
      </div>
      <hr>
    `).join('');

  } catch (err) {
    console.error(err);
    container.innerHTML = 'Failed to load products.';
  }
}

loadProducts();
