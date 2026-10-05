const cartContainer = document.getElementById('cart')

function renderCart() {
    const cart = getCart();
    if(cart.length === 0) {
        cartContainer.innerHTML = `<p>You cart is still empty</p>
        <button onclick="window.location.href='index.html'">Browse Products</button>`;
        return;
    }
    
    cart.map().join('')
}