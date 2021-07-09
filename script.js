// Query Selectors

let navToggler = document.querySelector(".navbar-toggler");
let navCollapse = document.querySelector(".navbar-collapse");
let cartBtn = document.getElementById("cart-btn");
let cartContainer = document.querySelector(".cart-container");
let productList = document.querySelector('.product-list');

let cartList = document.querySelector('.cart-list');
let cartTotalValue = document.getElementById('cart-total-value');
let cartCountInfo = document.getElementById('cart-count-info');
let cartItemID = 1;

//Event Listeners

navToggler.addEventListener("click", () => {
    console.log("adsasdasd");
    navCollapse.classList.toggle("show-navbar");
})

cartBtn.addEventListener('click', () => {
    cartContainer.classList.toggle("show-cart-container")
})


productList.addEventListener('click', purchaseProduct);

cartList.addEventListener('click', deleteProduct);


window.addEventListener('DOMContentLoaded', () => {
    loadJSON();
    loadCart();
});

//Functions

function updateCartInfo(){
    let cartInfo = findCartInfo();
    cartCountInfo.textContent = cartInfo.productCount;
    cartTotalValue.textContent = cartInfo.total;
}

function loadJSON() {
    fetch("accessories.json")
        .then(response => response.json())
        .then(data => {
            let html = '';
            data.forEach(product => {
                html += `<div class="product-item">
            <div class="product-img">
                <img src=${product.imgSrc} alt="product image">
                <button type="button" class="add-to-cart-btn">
                    <i class="fas fa-shopping-cart"></i>Add To Cart
                </button>
            </div>
            <div class="product-content">
                <h3 class="product-name">${product.name}</h3>
                <span class="product-category">${product.category}</span>
                <p class="product-price">$${product.price}</p>
            </div>
        </div>`;
            })
            productList.innerHTML=html;
        })
}

function purchaseProduct(e){
    if(e.target.classList.contains('add-to-cart-btn')){
        let product = e.target.parentElement.parentElement;
        getProductInfo(product);
    }
}
function getProductInfo(product){
    let productInfo = {
        id: cartItemID,
        imgSrc: product.querySelector('.product-img img').src,
        name: product.querySelector('.product-name').textContent,
        category: product.querySelector('.product-category').textContent,
        price: product.querySelector('.product-price').textContent
    }
    cartItemID++;
    addToCartList(productInfo);
    saveProductInStorage(productInfo);
}

function addToCartList(product){
    let div=document.createElement("div");
    div.classList.add("cart-item");
    div.setAttribute('data-id',`${product.id}`);
    div.innerHTML=`<img src="${product.imgSrc}" alt="product-img">
    <div class="cart-item-info">
        <h3 class="cart-item-name">${product.name}</h3>
        <span class="cart-item-category">${product.category}</span>
        <span class="cart-item-price">${product.price}</span>
    </div>
    <button class="cart-item-del-btn">
        <i class="fas fa-times"></i>
    </button>`;

    cartList.appendChild(div);
}

function saveProductInStorage(item){
    let products = getProductFromStorage();
    products.push(item);
    localStorage.setItem('products', JSON.stringify(products));
    updateCartInfo();
}


function getProductFromStorage(){
    return localStorage.getItem('products') ? JSON.parse(localStorage.getItem('products')) : [];
    // returns empty array if there isn't any product info
}

function loadCart(){
    let products = getProductFromStorage();
    if(products.length < 1){
        cartItemID = 1; // if there is no any product in the local storage
    } else {
        cartItemID = products[products.length - 1].id;
        cartItemID++;
        // else get the id of the last product and increase it by 1
    }
    products.forEach(product => addToCartList(product));
    updateCartInfo();
}

function findCartInfo(){
    let products = getProductFromStorage();
    let total = products.reduce((acc, product) => {
        let price = parseFloat(product.price.substr(1)); // removing dollar sign
        return acc += price;
    }, 0); // adding all the prices

    return{
        total: total.toFixed(2),
        productCount: products.length
    }
}

function deleteProduct(e){
    let cartItem;
    if(e.target.tagName === "BUTTON"){
        cartItem = e.target.parentElement;
        cartItem.remove(); // this removes from the DOM only
    } else if(e.target.tagName === "I"){
        cartItem = e.target.parentElement.parentElement;
        cartItem.remove(); // this removes from the DOM only
    }

    let products = getProductFromStorage();
    let updatedProducts = products.filter(product => {
        return product.id !== parseInt(cartItem.dataset.id);
    });
    localStorage.setItem('products', JSON.stringify(updatedProducts)); // updating the product list after the deletion
    updateCartInfo();
}