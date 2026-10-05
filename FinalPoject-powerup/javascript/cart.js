const cartContainer = document.getElementById('cart')

function renderCart() {
    const cart = getCart();
    if (cart.length === 0) {
        cartContainer.innerHTML = `<p>Your cart is still empty</p>
        <button onclick="window.location.href='shop.html'">Browse Products</button>`;
        return;
    }

    const rows = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <img src="${item.thumbnail}" alt="${item.title}">
            <div class="cart-item-info">
                <a href="product.html?id=${item.id}">${item.title}</a>
                <p>$${item.price.toFixed(2)} each</p>
            </div>
            <div class="cart-quantity">
                <button data-action="decrease" ${item.quantity <= 1 ? 'disabled' : ''}>-</button>
                <span>${item.quantity}</span>
                <button data-action="increase" ${item.quantity >= item.stock ? 'disabled' : ''}>+</button>
            </div>
            <p class="line-total">$${(item.price * item.quantity).toFixed(2)}</p>
            <button data-action="remove">Remove</button>
        </div>
    `).join('');

    cartContainer.innerHTML = `
        <div class="cart-items">${rows}</div>
        <div class="cart-summary">
            <h2>Order summary</h2>
            <p>Items: ${getCartCount()}</p>
            <p class="cart-total">Total: $${getCartTotal().toFixed(2)}</p>
            <a class="checkout-link" href="checkout.html">Proceed to checkout</a>
            <button data-action="clear">Clear cart</button>
        </div>
    `;
}

cartContainer.addEventListener('click', event => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
 
    const action = button.dataset.action;
 
    if (action === 'clear') {
        if (confirm('Remove all items from your cart?')) clearCart();
        renderCart();
        return;
    }
 
    const row = button.closest('.cart-item');
    const id = Number(row.dataset.id);
    const line = getCart().find(item => item.id === id);
    if (!line) return;
 
    if (action === 'increase') updateCartQuantity(id, line.quantity + 1);
    if (action === 'decrease') updateCartQuantity(id, line.quantity - 1);
    if (action === 'remove') removeFromCart(id);
 
    renderCart();
});

function init() {
    renderCart()
    navEventListners()
}

init();