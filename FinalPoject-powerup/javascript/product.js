const productDetails = document.getElementById("product-details");

function init() {
    const id = new URLSearchParams(window.location.search).get("id");
    if (!id) {
        handleProductNotFound();
        return;
    }

    fetchProduct(id);
    navEventListners();
    return;
}

function handleProductNotFound() {
    productDetails.innerHTML = `<p>Product not found</p>
            <button onclick="window.location.href='index.html'">Back to Home</button>`;
}

async function fetchProduct(id) {
    try {
        productDetails.innerHTML = `<p>Loading product details...</p>`;

        const response = await fetch(`https://dummyjson.com/products/${id}`);

        if (response.status === 404) {
            handleProductNotFound();
            return;
        }
        if (!response.ok) {
            throw new Error('Failed to fetch product');
        }
        const product = await response.json();
        renderProduct(product);

    } catch (error) {
        console.error(error);
        productDetails.innerHTML = `<p>Error loading product details.</p>
            <button class='try-again-button'>Try Again</button>`;

        if (Number.isInteger(Number(id)))
            document.querySelector('.try-again-button').addEventListener('click', () => fetchProduct(id));
    }
}

function renderProduct(product) {
    const { price, discountPercentage, finalPrice } = getPriceInfo(product);
    const images = product.images?.length ? product.images : [product.thumbnail];
    const inStock = product.stock > 0;

    document.title = `${product.title} - ShopFlow`;

    const thumbnails = images.map((src, index) => `
            <img class="gallery-thumb ${index === 0 ? 'active' : ''}"
                src="${src}" data-src="${src}" alt="${product.title} view ${index + 1}">
        `).join('');

    const reviews = product.reviews?.length
        ? product.reviews.map(review => `
                <div class="review">
                    <strong>${review.reviewerName}</strong>
                    <span>${'★'.repeat(Math.round(review.rating))}${'☆'.repeat(5 - Math.round(review.rating))}</span>
                    <small>${new Date(review.date).toLocaleDateString()}</small>
                    <p>${review.comment}</p>
                </div>
            `).join('')
        : '<p>No reviews yet.</p>';

    productDetails.innerHTML = `
            <div class="product-gallery">
                <img id="main-image" src="${images[0]}" alt="${product.title}">
                <div class="gallery-thumbs">${thumbnails}</div>
            </div>

            <div class="product-info">
                <p class="product-category">${product.category.replaceAll('-', ' ')}</p>
                <h1>${product.title}</h1>
                <p>Brand: ${product.brand ?? 'No brand'}</p>
                <p>Rating: ★ ${product.rating}</p>

                <div class="product-price">
                    <span class="final-price">$${finalPrice.toFixed(2)}</span>
                    ${discountPercentage > 0
            ? `<s>$${price.toFixed(2)}</s> <span class="discount">-${discountPercentage.toFixed(2)}%</span>`
            : ''}
                </div>

                <p>${product.description}</p>
                <p>${product.availabilityStatus} (${product.stock} in stock)</p>

                <div class="product-actions">
                    <input id="quantity-input" type="number" min="1" max="${product.stock}" value="1" ${inStock ? '' : 'disabled'}>
                    <button id="add-to-cart-button" ${inStock ? '' : 'disabled'}>${inStock ? 'Add to cart' : 'Out of stock'}</button>
                    <button id="favorite-button">Favorite</button>
                </div>

                <ul class="product-extra">
                    <li>Shipping: ${product.shippingInformation}</li>
                    <li>Warranty: ${product.warrantyInformation}</li>
                    <li>Returns: ${product.returnPolicy}</li>
                    <li>SKU: ${product.sku}</li>
                    <li>Weight: ${product.weight}</li>
                    ${product.tags?.length ? `<li>Tags: ${product.tags.join(', ')}</li>` : ''}
                </ul>
            </div>

            <div class="product-reviews">
                <h2>Reviews</h2>
                ${reviews}
            </div>
        `;

    document.querySelectorAll('.gallery-thumb').forEach(thumb => {
        thumb.addEventListener('click', () => {
            document.getElementById('main-image').src = thumb.dataset.src;
            document.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
        });
    });

    handleButtons(product);
}

function handleButtons(product) {
    const addToCartBtn = document.getElementById('add-to-cart-button');
    const quantityInput = document.getElementById('quantity-input');
    const favoriteBtn = document.getElementById('favorite-button');

    function updateFavoriteLabel() {
        favoriteBtn.textContent = isFavorite(product.id) ? 'Remove from favorites' : 'Add to favorites';
    }
    updateFavoriteLabel();

    addToCartBtn.addEventListener('click', () => {
        const quantity = Number(quantityInput.value);
        const existing = getCart().find(item => item.id === product.id)?.quantity ?? 0;
        const remaining = product.stock - existing;

        if (!Number.isInteger(quantity) || quantity < 1) {
            alert('Enter a whole number of 1 or more.');
            return;
        }
        if (product.stock <= 0) {
            alert('This product is out of stock.');
            return;
        }
        if (remaining <= 0) {
            alert('You already have the maximum in your cart.');
            return;
        }
        if (quantity > remaining) {
            alert(`Only ${remaining} more available.`);
            return;
        }

        addToCart(product, quantity);
        alert(`Added ${quantity} ${quantity === 1 ? 'item' : 'items'} to cart.`);
    });

    favoriteBtn.addEventListener('click', () => {
        toggleFavorite(product.id);
        updateFavoriteLabel();
    });
}

init();