let allProducts = [];
let cart = [];

async function fetchItems() {
    try {
        const response = await fetch('/api/items', {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
        allProducts = await response.json();
        displayItems(allProducts);
    } catch (err) { console.error("Error fetching items:", err); }
}

function displayItems(products) {
    const grid = document.getElementById('itemGrid');
    grid.innerHTML = products.map(item => {
        const stock = item.stock !== undefined ? item.stock : (item.quantity !== undefined ? item.quantity : 0);
        return `
            <div class="item-card ${stock <= 0 ? 'out-of-stock' : ''}" 
                 onclick="${stock > 0 ? `addToCart(${item.id})` : ''}">
                <span style="display:block; font-weight:600">${item.name}</span>
                <span style="color:#3b82f6">₱${(item.price || 0).toFixed(2)}</span>
                <small style="display:block; color:#64748b">Stock: ${stock}</small>
            </div>
        `;
    }).join('');
}

function addToCart(id) {
    const item = allProducts.find(p => p.id === id);
    const existing = cart.find(c => c.id === id);
    if (existing) existing.quantity++;
    else cart.push({ ...item, quantity: 1 });
    updateCartUI();
}

function updateCartUI() {
    const container = document.getElementById('cartItems');
    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <span>${item.name} x${item.quantity}</span>
            <span>₱${((item.price || 0) * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');
    calculateTotal();
}

function calculateTotal() {
    const subtotal = cart.reduce((sum, item) => sum + ((item.price || 0) * item.quantity), 0);
    const discount = parseFloat(document.getElementById('discountInput').value) || 0;
    const total = Math.max(0, subtotal - discount);
    document.getElementById('subtotalDisplay').textContent = `₱${subtotal.toFixed(2)}`;
    document.getElementById('totalDisplay').textContent = `₱${total.toFixed(2)}`;
}

async function fetchOrders() {
    try {
        const response = await fetch('/api/orders', {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
        const orders = await response.json();
        
        document.getElementById('totalOrders').textContent = orders.length;
        document.getElementById('completedOrders').textContent = orders.filter(o => o.status === 'COMPLETED').length;
        document.getElementById('pendingOrders').textContent = orders.filter(o => o.status === 'PENDING').length;
        document.getElementById('totalSales').textContent = `₱${orders.reduce((s, o) => s + (o.totalAmount || 0), 0).toLocaleString()}`;
        
        document.getElementById('orderTableBody').innerHTML = orders.map(o => {
            const rawDate = o.createdAt || o.orderDate || o.date || o.dateTime;
            let displayDate = 'N/A';
            if (rawDate) {
                const dateObj = new Date(rawDate);
                if (!isNaN(dateObj.getTime())) displayDate = dateObj.toLocaleDateString();
            }

            const isPending = (o.status || 'PENDING') === 'PENDING';

            return `
                <tr>
                    <td>#${o.orderNumber || o.id}</td>
                    <td>${o.customerName || 'Walk-in'}</td>
                    <td>${(o.items || []).length} items</td>
                    <td>₱${(o.totalAmount || 0).toFixed(2)}</td>
                    <td><span class="badge badge-${(o.status || 'PENDING').toLowerCase()}">${o.status || 'PENDING'}</span></td>
                    <td>${displayDate}</td>
                    <td>
                        <div class="action-buttons">
                            ${isPending ? `
                                <button class="btn-complete" onclick="updateStatus(${o.id}, 'COMPLETED')">Done</button>
                                <button class="btn-cancel" onclick="updateStatus(${o.id}, 'CANCELLED')">Cancel</button>
                            ` : ''}
                            <button class="btn-delete" onclick="deleteOrder(${o.id})">Delete</button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    } catch (err) { console.error("Error fetching orders:", err); }
}

async function updateStatus(orderId, status) {
    if (!confirm(`Mark order as ${status}?`)) return;
    try {
        // Ensure the query parameter key matches your @RequestParam in Java
        const response = await fetch(`/api/orders/${orderId}/status?status=${status}`, {
            method: 'PUT',
            headers: { 
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            fetchOrders(); // Refresh table to show "CANCELLED"
        } else {
            console.error("Failed to update status");
        }
    } catch (err) { 
        console.error("Update failed:", err); 
    }
}

async function deleteOrder(orderId) {
    if (!confirm("Are you sure you want to delete this order record?")) return;
    try {
        await fetch(`/api/orders/${orderId}`, {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
        fetchOrders();
    } catch (err) { console.error("Delete failed:", err); }
}
