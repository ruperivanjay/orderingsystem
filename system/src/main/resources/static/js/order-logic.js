let allProducts = [];
let cart = [];

// 1. Fetch Items from Backend
async function fetchItems() {
    try {
        const response = await fetch('/api/items', {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
        allProducts = await response.json();
        displayItems(allProducts);
    } catch (err) {
        console.error("Error loading products:", err);
    }
}

// 2. Display Items in Grid
function displayItems(products) {
    const grid = document.getElementById('itemGrid');
    grid.innerHTML = products.map(item => `
        <div class="item-card ${item.stock <= 0 ? 'out-of-stock' : ''}" 
             onclick="${item.stock > 0 ? `addToCart(${item.id})` : ''}">
            <span class="item-name">${item.name}</span>
            <span class="item-price">₱${item.price.toFixed(2)}</span>
            <small style="display:block; color:#6b7280">Stock: ${item.stock}</small>
        </div>
    `).join('');
}

// 3. Cart Management
function addToCart(id) {
    const item = allProducts.find(p => p.id === id);
    const existing = cart.find(c => c.id === id);
    
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    updateCartUI();
}

function updateCartUI() {
    const container = document.getElementById('cartItems');
    if (cart.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding:1rem; color:#9ca3af;">Empty cart</div>';
        return;
    }

    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <span>${item.name} (x${item.quantity})</span>
            <span>₱${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');
    calculateTotal();
}

function calculateTotal() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = parseFloat(document.getElementById('discountInput').value) || 0;
    const total = Math.max(0, subtotal - discount);

    document.getElementById('subtotalDisplay').textContent = `₱${subtotal.toFixed(2)}`;
    document.getElementById('totalDisplay').textContent = `₱${total.toFixed(2)}`;
}

// 4. Fetch Order History
async function fetchOrders() {
    try {
        const response = await fetch('/api/orders', {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
        const orders = await response.json();
        updateStats(orders);
        displayOrders(orders);
    } catch (err) {
        console.error("Error loading orders:", err);
    }
}

function updateStats(orders) {
    document.getElementById('totalOrders').textContent = orders.length;
    document.getElementById('completedOrders').textContent = orders.filter(o => o.status === 'COMPLETED').length;
    document.getElementById('pendingOrders').textContent = orders.filter(o => o.status === 'PENDING').length;
    
    const totalSales = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    document.getElementById('totalSales').textContent = `₱${totalSales.toLocaleString()}`;
}

function displayOrders(orders) {
    const tbody = document.getElementById('orderTableBody');
    tbody.innerHTML = orders.map(order => `
        <tr>
            <td>#${order.orderNumber}</td>
            <td>${order.customerName}</td>
            <td>${order.items.length} items</td>
            <td>₱${order.totalAmount.toFixed(2)}</td>
            <td><span class="badge badge-${order.status.toLowerCase()}">${order.status}</span></td>
            <td>${new Date(order.createdAt).toLocaleDateString()}</td>
            <td><button onclick="viewReceipt(${order.id})" class="back-btn" style="color:#4f46e5">View</button></td>
        </tr>
    `).join('');
}
