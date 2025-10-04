
async function loadProducts() {
  const folder = '/content/products/';
  
  // List of known product files – later you can automate this with GitHub API if needed
  const files = [
    'product1.md',
    'product2.md',
    'product3.md'
  ];

  const products = [];

  for (const file of files) {
    try {
      const res = await fetch(folder + file);
      if (!res.ok) continue;

      const text = await res.text();

      // Extract frontmatter (YAML between ---)
      const match = text.match(/---([\s\S]*?)---/);
      if (!match) continue;

      const yaml = match[1].trim().split('\n');
      const data = {};

      yaml.forEach(line => {
        const [key, ...rest] = line.split(':');
        if (key && rest.length) {
          data[key.trim()] = rest.join(':').trim().replace(/"/g, '');
        }
      });

      products.push(data);

    } catch (err) {
      console.error('Error loading product:', file, err);
    }
  }

  // Display products
  const container = document.getElementById('products');
  container.innerHTML = products.map(p => `
    <div class="product">
      <img src="${p.image}" alt="${p.title}" class="product-img">
      <h3>${p.title}</h3>
      <p>${p.description}</p>
      <span class="price">${p.price}</span>
    </div>
  `).join('');
}

loadProducts();
