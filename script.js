let menu = document.getElementById('menu');
let nav = document.querySelector('.navlinks');
let shade = document.getElementById('shade')
let closebtn = document.getElementById('close');
const tesses = document.querySelectorAll('.tess');
let cartbtn = document.querySelectorAll('#cart');
let opencart = document.querySelectorAll('#opencart');
let sidebar = document.querySelector('.sidebar');
let closecart = document.getElementById('closecart')




menu.onclick = function(){
    nav.style.right = '0';
    shade.classList.toggle('active')
}
closebtn.onclick = function(){
    nav.style.right = '-250px';
    shade.classList.remove('active')
}

shade.onclick = function(e){
    if(e.target.id !== menu){
        nav.style.right = '-250px' ;
        shade.classList.remove('active'); 
        sidebar.style.display = 'none'
    }
}
nav.onclick = function(){
   nav.style.right = '-250px'
   shade.classList.remove('active')
}

window.addEventListener('scroll', worktess);

function worktess(){
    const triggerBottom = window.innerHeight / 5 * 4;

    tesses.forEach(tess =>{
        const testop = tess.getBoundingClientRect().top;

        if(testop < triggerBottom){
            tess.classList.add('show');
        }else{
            tess.classList.remove('show');
        }
    })
}

opencart.forEach(open =>{
    open.onclick = function(){
        if(sidebar.style.display == 'block'){
            sidebar.style.display = 'none'
            shade.classList.remove('active')
        }else{
            sidebar.style.display = 'block'
            shade.classList.toggle('active')
        }
    }
})

closecart.onclick = function(){
    sidebar.style.display = 'none'
    shade.classList.remove('active')
}



let Products = null;

fetch ('Products.json')
.then(response => response.json())
.then(data => {
  Products = data;
  addDataToHTML()
})

// Adding a search function
function filterProducts(searchTerm) {
  if (!Products) return [];
  return Products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
}

// Modifying the addDataToHTML function
function addDataToHTML(searchTerm = '') {
  let listProductHTML = document.querySelector('.row-6');
  listProductHTML.innerHTML = '';
  
  let filteredProducts = filterProducts(searchTerm); // Get filtered products

  if (filteredProducts.length > 0) {
    filteredProducts.forEach(product => {
      let newProduct = document.createElement('div');
      newProduct.classList.add('col');
      newProduct.innerHTML = `
        <div class="col">
          <div class="card">
            <img src="${product.image}">
          </div>
          <div class="small-row">
            <div class="captions">
              <h4 id="header">${product.name}</h4>
              <p>$${product.price}</p>
            </div>
            <div class="cartbtn">
              <button class="btn-5" id="cart" onclick="addcart(${product.id})">Add to cart</button>
            </div>
          </div>
        </div>
      `;
      listProductHTML.appendChild(newProduct);
    });
  } else {
    listProductHTML.innerHTML = `<p>No products found.</p>`;
  }
}

// Attach search event
document.querySelector('#search-input').addEventListener('input', (event) => {
  const searchTerm = event.target.value;
  addDataToHTML(searchTerm); // Update product list based on search term
});


let listCart = [];
function checkCart(){
  var cookieValue = document.cookie
  .split(';')
  .find(row => row.startsWith('listCart='));
  if (cookieValue){
    listCart = JSON.parse(cookieValue.split('=')[1]);
  }
  
}
checkCart()
function addcart($idproduct){
  let productCopy = JSON.parse(JSON.stringify(Products));

  if(!listCart[$idproduct]){
    let dataProduct = productCopy.filter(
      product => product.id == $idproduct
    )[0];
    listCart[$idproduct] = dataProduct
    listCart[$idproduct].quantity = 1;
  }else{
    listCart[$idproduct].quantity ++;
  }

  let timesave = "expires = Thus, 31 Dec 2025 23:59:59 UTC";
  document.cookie = "listCart="+JSON.stringify(listCart)+"; "+timesave+"; path=/;";
  addCartTOHTML();
}
addCartTOHTML();
function addCartTOHTML(){
  let listCartHTML = document.querySelector('.listCart');
  listCartHTML.innerHTML = '';


  let totalHTML = document.querySelector('.totalQuantity');
  let totalQuantity = 0;  
  
  if(listCart.length == 0){
    listCartHTML.innerHTML = 'You have no products in your cart';
    totalQuantity = 0;
  }else{
    if(listCart){
      listCart.forEach(product => {
        if(product){
          let newCart = document.createElement('div');
          newCart.classList.add('cartItem');
          newCart.innerHTML = 
          `<img src="${product.image}">
              <div class="cart_content">
                  <div class="name">
                      ${product.name}
                  </div>
                  <div class="price">
                      $${product.price}
                  </div>
              </div>
              <div class="quantity">
                  <button onclick ="changeQuantity(${product.id}, '+')">+</button>
                  <span class="value">${product.quantity}</span>
                  <button onclick ="changeQuantity(${product.id}, '-')">-</button>
              </div>
              <div classname="delete_product">
                <button class="delete-btn" onclick ="changeQuantity(${product.id}, '*')"><i class="fas fa-trash"></i></button>
              </div>
              `
          listCartHTML.appendChild(newCart);    
          totalQuantity = totalQuantity + product.quantity                  
        }
      })
    }
    
  }
  totalHTML.innerHTML = totalQuantity

  

}
function changeQuantity($idproduct, $type) {
  switch ($type) {
    case '+':
        listCart[$idproduct].quantity++;
        break;
    case '-':
        listCart[$idproduct].quantity--;

        // if quantity <= 0 then remove product in cart
        if(listCart[$idproduct].quantity <= 0){
            delete listCart[$idproduct];
        }
        break;
    case '*':
      delete listCart[$idproduct];
      break;    

    default:
        break;
}
// save new data in cookie
document.cookie = "listCart=" + JSON.stringify(listCart) + "; expires=Thu, 31 Dec 2025 23:59:59 UTC; path=/;";
// reload html view cart
addCartTOHTML();

}


let clear = document.querySelector('#reset')

clear.onclick = () =>{
  listCart = [];

  // Remove the cart from cookies
  const expireTime = "expires=Thu, 01 Jan 1970 00:00:00 UTC"; // Set expired time
  document.cookie = `listCart=; ${expireTime}; path=/;`;

  // Update the cart display
  addCartTOHTML();
}

let searchbtn = document.querySelector('#searchbtn');
let searchspc = document.querySelector('.searchspc');
searchbtn.onclick = () =>{
  if(searchspc.style.display == 'block'){
    searchspc.style.display = 'none';
  }else{
    searchspc.style.display = 'block';
  }
  
}

