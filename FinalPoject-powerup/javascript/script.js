const productContainer = document.getElementById('product-container');
const searchInput = document.getElementById('search-input');
const categorySelect = document.getElementById('category-select');
const sortSelect = document.getElementById('sort-select');

let currentPageNumber = 1;
const itemsPerPage = 16;
let allProducts = [];
let searchText = '', selectedCategory = 'all', sortBy = '';

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
    const finalPrice = price * (1 - discountPercentage / 100);
    return { price, discountPercentage: discountPercentage, finalPrice };
}

function getVisibleProducts() {
    return allProducts.filter(product => {
        const matchesSearchText = product.title.toLowerCase().includes(searchText.trim().toLowerCase());
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        return matchesSearchText && matchesCategory;
    }).sort((a, b) => {
        const aPriceInfo = getPriceInfo(a);
        const bPriceInfo = getPriceInfo(b);
        if (sortBy === 'priceLowToHigh') return aPriceInfo.finalPrice - bPriceInfo.finalPrice;
        if (sortBy === 'priceHighToLow') return bPriceInfo.finalPrice - aPriceInfo.finalPrice;
        return 0;
    });
}

function updateProducts() {
    const filteredList = getVisibleProducts();

    const totalPages = filteredList.length / itemsPerPage;
    const skip = ( currentPageNumber - 1 ) * itemsPerPage;

    const pageItems = filteredList.slice(skip, skip + itemsPerPage);
    renderProducts(pageItems);

}



function mainEventListeners() {
    categorySelect.addEventListener('change', function () {
        selectedCategory = categorySelect.value;
        currentPageNumber = 1;
        updateProducts();
    });

    sortSelect.addEventListener('change', function () {
        sortBy = sortSelect.value;
        currentPageNumber = 1;
        updateProducts();
    });

    searchInput.addEventListener('input', function () {
        searchText = searchInput.value;
        currentPageNumber = 1;
        updateProducts();
    });
}

function fillCategories(products) {
    categorySelect.innerHTML = `<option value="all">All Categories</option>`;
    [...new Set(products.map(p => p.category))].forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category.replaceAll('-', ' ');
        categorySelect.appendChild(option);
    });
    categorySelect.value = 'all';
}

function renderProducts(list) {
    if (list.length === 0) {
        productContainer.innerHTML = 'No products match your search.';
        return;
    }

    productContainer.innerHTML = list.map(product => {
        const priceInfo = getPriceInfo(product);
        return `<div class="product">
            <img src="${product.thumbnail}" alt="${product.title}"/>
            <h2>${product.title}</h2>
            <p>Price: ${priceInfo.price.toFixed(2)}$</p>
            ${product.discountPercentage>0 ? `<p>Discount: ${product.discountPercentage.toFixed(2)}%</p>` : ''}
            ${product.discountPercentage>0 ? `<p>Final Price: ${priceInfo.finalPrice.toFixed(2)}$</p>` : ''}
        </div>`;
    }).join('');
}

async function start() {
    productContainer.innerHTML = 'Loading products...';

    try {
        allProducts = await fetchAllProduct();
        updateProducts();
        fillCategories(allProducts);
        mainEventListeners();
    }
    catch (error) {
        console.error('Error fetching products:', error);
        productContainer.innerHTML = 'Failed to load products.';
    }
}
start();    