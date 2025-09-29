
const products = [
  {id:1,title:"Hospital Bed",price:"KES 25,000",img:"assets/images/hero.jpg"},
  {id:2,title:"Wheelchair",price:"KES 8,500",img:"assets/images/hero.jpg"},
  {id:3,title:"Oxygen Concentrator",price:"KES 95,000",img:"assets/images/hero.jpg"},
  {id:4,title:"Surgical Gloves",price:"KES 1,200",img:"assets/images/hero.jpg"},
  {id:5,title:"BP Monitor",price:"KES 4,500",img:"assets/images/hero.jpg"}
];

function renderProducts(filter=""){
  const list = document.getElementById('product-list');
  list.innerHTML = "";
  products.filter(p => p.title.toLowerCase().includes(filter.toLowerCase())).forEach(p=>{
    const card = document.createElement('article');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.title}" loading="lazy">
      <h4>${p.title}</h4>
      <p class="price">${p.price}</p>
      <div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap">
        <a class="btn" href="https://wa.me/254768675020?text=Hi%2C%20I%20am%20interested%20in%20${encodeURIComponent(p.title)}%20(${encodeURIComponent(p.price)})">WhatsApp</a>
        <a class="btn" href="#" onclick="alert('Viewing details for ${p.title}')">View</a>
      </div>
    `;
    list.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', function(){
  renderProducts();
  const searchInput = document.getElementById('searchInput');
  if(searchInput){
    searchInput.addEventListener('input', e => {
      renderProducts(e.target.value);
    });
  }
});
