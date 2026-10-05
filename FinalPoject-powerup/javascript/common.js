function getPriceInfo(product) {
    const price = product.price;
    const discountPercentage = product.discountPercentage;
    const finalPrice = price * (1 - discountPercentage / 100);
    return { price, discountPercentage: discountPercentage, finalPrice };
}

function getFromStorage(key, fallback) {
    try {
        const value = localStorage.getItem(key);
        return value !== null ? JSON.parse(value) : fallback;
    }
    catch (error) {
        console.error(error);
        return fallback;
    }
}

function saveToStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    }
    catch (error) {
        console.error(error);
    }
}
function getFavorites() {
    return getFromStorage('favorites', []);
}

function isFavorite(id) {
    return getFavorites().includes(Number(id));
}

function toggleFavorite(id) {
    id = Number(id);
    const favorites = getFavorites();
    const exists = favorites.includes(id);

    const updated = exists
        ? favorites.filter(favoriteId => favoriteId !== id)
        : [...favorites, id];

    saveToStorage('favorites', updated);
    return !exists;
}

function getCart() {
    return getFromStorage('cart', []);
}

function addToCart(product, quantity) {
    const cart = getCart();
    const id = Number(product.id);
    const qty = Number(quantity);
    const line = cart.find(item => item.id === id);

    if (line) {
        line.quantity = Math.min(line.quantity + qty, product.stock);
    } else {
        cart.push({
            id,
            title: product.title,
            thumbnail: product.thumbnail,
            price: Math.round(getPriceInfo(product).finalPrice * 100) / 100,
            stock: product.stock,
            quantity: Math.min(qty, product.stock)
        });
    }

    saveToStorage('cart', cart);
    updateCartBadge();
}

function getCartCount() {
    return getCart().reduce((total, item) => total + item.quantity, 0);
}

function updateCartBadge() {
    const badge = document.getElementById('cart-count');
    if (badge) badge.textContent = getCartCount();
}

document.addEventListener('DOMContentLoaded', updateCartBadge);

function updateCartQuantity(id, quantity) {
    const cart = getCart();
    const line = cart.find(item => item.id === Number(id));
    if (!line) return;

    line.quantity = Math.min(Math.max(Number(quantity), 1), line.stock);

    saveToStorage('cart', cart);
    updateCartBadge();
}

function removeFromCart(id) {
    const newCart = getCart().filter(item => item.id !== Number(id));
    saveToStorage('cart', newCart);
    updateCartBadge();
}

function getCartTotal() {
    const cents = getCart().reduce((sum, item) => {
        return sum + Math.round(item.price * 100) * item.quantity;
    }, 0);
    return cents / 100;
}

function clearCart() {
    saveToStorage('cart', []);
    updateCartBadge();
}

function getTheme() {
    const saved = getFromStorage('theme', null);
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;

    const button = document.querySelector('.darkLightToggle');
    if (button) button.textContent = theme === 'dark' ? '☼' : '☾';
}

function toggleTheme() {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    saveToStorage('theme', next);
    applyTheme(next);
}

function navEventListners() {
    const cartButton = document.querySelector('.cartButton');
    const checkoutButton = document.querySelector('.ordersButton');

    cartButton.addEventListener('click', () => {
        window.location.href = 'cart.html';
    })

    checkoutButton.addEventListener('click', () => {
        window.location.href = 'checkout.html';
    });
}

applyTheme(getTheme());

document.addEventListener('DOMContentLoaded', () => {
    applyTheme(getTheme()); // the header exists now, so the button label gets set too
    document.querySelector('.darkLightToggle')?.addEventListener('click', toggleTheme);
});