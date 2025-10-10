// Sample products array
// Replace with your real products fetched from .md files or API
const products = [
  {
    name: "Hospital Bed",
    price: 15000,
    image: "hospital-bed.jpg",
  },
  {
    name: "Wheelchair",
    price: 12000,
    image: "wheelchair.jpg",
  },
  {
    name: "Oxygen Concentrator",
    price: 45000,
    image: "oxygen-concentrator.jpg",
  },
];

// DOM elements
const productList = document.getElementById("product-list");
const searchInput = document.getElementById("searchInput");

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

// Initial render
renderProducts(products);

// Search functionality
searchInput.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();
  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(query)
  );
  renderProducts(filtered);
});
