const checkoutContainer = document.getElementById('checkout');
const ordersContainer = document.getElementById('orders');

/* helpers */

// Anything the user types and we later show with innerHTML must be escaped,
// otherwise a name like <img onerror=...> would run as code.
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function getOrders() {
    const orders = getFromStorage('orders', []);
    return Array.isArray(orders) ? orders : [];
}

function formField(name, label, type = 'text') {
    return `
        <div class="form-field">
            <label for="${name}">${label}</label>
            <input id="${name}" name="${name}" type="${type}">
            <small class="error" id="${name}-error"></small>
        </div>`;
}

/* validation: each rule returns an error message, or '' when the value is fine */

const validators = {
    name: value => value.length >= 2 ? '' : 'Enter your full name (at least 2 characters).',
    email: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Enter a valid email address.',
    phone: value => /^\+?\d{7,15}$/.test(value.replace(/[\s-]/g, '')) ? '' : 'Enter a valid phone number (7 to 15 digits).',
    address: value => value.length >= 5 ? '' : 'Enter your street address.',
    city: value => value.length >= 2 ? '' : 'Enter your city.'
};

// Returns the customer data when everything is valid, otherwise null.
function validateForm(form) {
    const customer = {};
    let valid = true;

    for (const name in validators) {
        const input = form.elements[name];
        const value = input.value.trim();
        const message = validators[name](value);

        document.getElementById(`${name}-error`).textContent = message;
        input.setAttribute('aria-invalid', message ? 'true' : 'false');

        if (message) valid = false;
        customer[name] = value;
    }

    customer.payment = form.elements.payment.value;
    return valid ? customer : null;
}

/* checkout section */

function renderCheckout() {
    const cart = getCart();

    if (cart.length === 0) {
        checkoutContainer.innerHTML = `
            <p>Your cart is empty.</p>
            <a href="index.html">Browse products</a>`;
        return;
    }

    const items = cart.map(item => `
        <li>${escapeHtml(item.title)} x ${item.quantity}
            <span>$${(item.price * item.quantity).toFixed(2)}</span></li>
    `).join('');

    checkoutContainer.innerHTML = `
        <div class="checkout-summary">
            <h2>Order summary</h2>
            <ul>${items}</ul>
            <p class="cart-total">Total: $${getCartTotal().toFixed(2)}</p>
            <a href="cart.html">Edit cart</a>
        </div>

        <form id="checkout-form" novalidate>
            <h2>Customer information</h2>
            ${formField('name', 'Full name')}
            ${formField('email', 'Email', 'email')}
            ${formField('phone', 'Phone', 'tel')}
            ${formField('address', 'Address')}
            ${formField('city', 'City')}
            <div class="form-field">
                <label for="payment">Payment method</label>
                <select id="payment" name="payment">
                    <option value="Cash on delivery">Cash on delivery</option>
                    <option value="Card (simulated)">Card (simulated)</option>
                </select>
            </div>
            <button type="submit" id="place-order">Place order</button>
        </form>
    `;
}

// One listener on the container: the form is rebuilt by renderCheckout().
checkoutContainer.addEventListener('submit', event => {
    event.preventDefault();

    const form = event.target;
    const customer = validateForm(form);

    if (!customer) {
        form.querySelector('[aria-invalid="true"]')?.focus();
        return;
    }

    // Fake payment: disable the button so the order can't be sent twice.
    const button = document.getElementById('place-order');
    button.disabled = true;
    button.textContent = 'Processing...';

    setTimeout(() => placeOrder(customer), 1200);
});

function placeOrder(customer) {
    const cart = getCart();
    if (cart.length === 0) {
        renderCheckout();
        return;
    }

    const order = {
        id: 'SF-' + Date.now(),
        date: new Date().toISOString(),
        customer,
        items: cart.map(({ id, title, price, quantity }) => ({ id, title, price, quantity })),
        total: getCartTotal()
    };

    saveToStorage('orders', [order, ...getOrders()]); // newest first
    clearCart();

    checkoutContainer.innerHTML = `
        <div class="order-success">
            <h2>Thank you, ${escapeHtml(customer.name)}!</h2>
            <p>Your order <strong>${order.id}</strong> was placed. Total: $${order.total.toFixed(2)}.</p>
            <a href="index.html">Continue shopping</a>
        </div>`;

    renderOrders();
}

/* previous orders section */

function renderOrders() {
    const orders = getOrders();

    if (orders.length === 0) {
        ordersContainer.innerHTML = `<h2>Previous orders</h2><p>No orders yet.</p>`;
        return;
    }

    ordersContainer.innerHTML = `<h2>Previous orders</h2>` + orders.map(order => `
        <details class="order">
            <summary>${order.id} - ${new Date(order.date).toLocaleDateString()} - $${order.total.toFixed(2)}</summary>
            <ul>
                ${order.items.map(item => `
                    <li>${escapeHtml(item.title)} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}</li>
                `).join('')}
            </ul>
            <p>Ship to: ${escapeHtml(order.customer.name)}, ${escapeHtml(order.customer.address)}, ${escapeHtml(order.customer.city)}</p>
            <p>Payment: ${escapeHtml(order.customer.payment)}</p>
        </details>
    `).join('');
}

renderCheckout();
renderOrders();