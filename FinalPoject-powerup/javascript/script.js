const productContainer = document.getElementById('product-container');
const searchInput = document.getElementById('search-input');
const categorySelect = document.getElementById('category-select');
const sortSelect = document.getElementById('sort-select');
const paginationContainer = document.getElementById('pagination');
const cartButton = document.querySelector('.cartButton');

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

    const totalPages = Math.ceil(filteredList.length / itemsPerPage);
    const skip = (currentPageNumber - 1) * itemsPerPage;

    const pageItems = filteredList.slice(skip, skip + itemsPerPage);
    renderProducts(pageItems);

    renderPagination(totalPages);
}

function renderPagination(totalPages) {
    if (totalPages > 1) {
        paginationContainer.style.display = 'block';

        paginationContainer.innerHTML = `
            <button id="prev-button" ${currentPageNumber === 1 ? 'disabled' : ''}>Previous</button>
            <span>Page ${currentPageNumber} of ${Math.ceil(totalPages)}</span>
            <button id="next-button" ${currentPageNumber === Math.ceil(totalPages) ? 'disabled' : ''}>Next</button>
        `;

        document.getElementById('prev-button').addEventListener('click', () => {
            if (currentPageNumber > 1) {
                currentPageNumber--;
                updateProducts();
                window.scrollTo(0, 0);
            }
        });
        
        document.getElementById('next-button').addEventListener('click', () => {
            if (currentPageNumber < Math.ceil(totalPages)) {
                currentPageNumber++;
                updateProducts();
                window.scrollTo(0, 0);
            }
        });
    } else {
        paginationContainer.style.display = 'none';
    }


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

    cartButton.addEventListener('click', () => {
        window.location.href = 'cart.html';
    })
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
          <a href='product.html?id=${product.id}'>
            <img src="${product.thumbnail}" alt="${product.title}"/>
            <h2>${product.title}</h2>
          </a>
            <p>Price: $${priceInfo.price.toFixed(2)}</p>
            ${product.discountPercentage > 0 ? `<p>Discount: ${product.discountPercentage.toFixed(2)}%</p>` : ''}
            ${product.discountPercentage > 0 ? `<p>Final Price: $${priceInfo.finalPrice.toFixed(2)}</p>` : ''}
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