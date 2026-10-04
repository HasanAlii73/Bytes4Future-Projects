const productContainer = document.getElementById('product-container');
const categorySelect = document.getElementById('category-select');
const sortSelect = document.getElementById('sort-select');

let currentPageNumber = 1;
const itemsPerPage = 16;
let allProducts = [];
let searchText='', selectedCategory='', sortBy = '';

async function fetchAllProduct() {
    const res = await fetch(`https://dummyjson.com/products?limit=100`);

    if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    return data.products;
}

function getPriceInfo(product) {
    const price = product.price;
    const discountPercentage = product.discountPercentage;
    const finalPrice = price * (1- discountPercentage/100);
    return { price, discountAmount: discountPercentage, finalPrice };
}

function getVisibleProducts() {
    return allProducts;
}

function renderMain(list) {
    renderProducts(list);

    categorySelect.innerHTML = ``;
    list.[...new Set(list.map(p => p.category))].forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
    categorySelect.value = 'all';
    
}

function renderProducts(list) {
    if(list.length === 0) {
        productContainer.innerHTML = 'No products available.';
        return;
    }

    productContainer.innerHTML = list.map(product => {
        const priceInfo = getPriceInfo(product);
        return `<div class="product">
            <img src="${product.thumbnail}" alt="${product.title}"/>
            <h2>${product.title}</h2>
            <p>Price: ${priceInfo.price}</p>
            <p>Discount: ${product.discountPercentage}%</p>
            <p>Final Price: ${priceInfo.finalPrice.toFixed(2)}
        </div>`;
    }).join('');
}

async function start() {
    productContainer.innerHTML = 'Loading products...';

    try{

        allProducts = await fetchAllProduct();
        renderProducts(allProducts);
    }
    catch (error) {
        console.error('Error fetching products:', error);
        productContainer.innerHTML = 'Failed to load products.';
    }
}
start();    