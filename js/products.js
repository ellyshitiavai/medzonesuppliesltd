const productList = document.getElementById("product-list");
const searchInput = document.getElementById("searchInput");

// Initialize an empty array to hold the current list of products
let currentProducts = [];

// Fetch products dynamically from CMS JSON
async function loadProducts() {
  try {
    const response = await fetch('/products.json'); // Ensure this path is correct
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();

    // Map CMS data to required format
    const products = data.map(item => ({
      name: item.name,
      price: item.price,
      image: item.image || 'placeholder.jpg', // fallback image
    }));

    // Store loaded products for search
    currentProducts = products;

    renderProducts(products);
  } catch (error) {
    console.error('Failed to load products:', error);
    productList.innerHTML = '<p style="text-align:center;">Failed to load products.</p>';
  }
}

// Function to render products
function renderProducts(list) {
  productList.innerHTML = "";

  if (list.length === 0) {
    productList.innerHTML = `<p style="text-align:center;">No products found</p>`;
    return;
  }

  list.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.classList.add("product-card");

    productCard.innerHTML = `
      <img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy" />
      <h4>${product.name}</h4>
      <p class="price">KES ${product.price.toLocaleString()}</p>
      <div class="product-contact" style="display:flex; gap:10px; justify-content:center; margin-top:8px;">
        <a href="https://wa.me/254768675020?text=Hi,%20I'm%20interested%20in%20your%20MEDZONE%20SUPPLIES%20AD:%20${encodeURIComponent(product.name)}%20-%20KES%20${product.price}" target="_blank" class="icon-btn whatsapp-btn">
          <i class="fab fa-whatsapp"></i>
        </a>
        <a href="tel:+254768675020" class="icon-btn call-btn">
          <i class="fas fa-phone"></i>
        </a>
      </div>
    `;

    productList.appendChild(productCard);
  });
}

// Search functionality
searchInput.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();
  const filtered = currentProducts.filter((p) =>
    p.name.toLowerCase().includes(query)
  );
  renderProducts(filtered);
});

// Initialize
loadProducts();
