// Load products into the grid
async function fetchItems() {
    try {
        const response = await fetch('/api/products', {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
        const items = await response.json();
        const grid = document.getElementById('itemGrid');
        
        if (grid && Array.isArray(items)) {
            grid.innerHTML = items.map(item => `
                <div class="item-card" onclick="addToCart(${item.id})">
                    <strong>${item.name}</strong><br>
                    ₱${item.price.toFixed(2)}
                </div>
            `).join('');
        }
    } catch (err) {
        console.error("Failed to load items:", err);
    }
}

// Load orders into the table
async function fetchOrders() {
    try {
        const response = await fetch('/api/orders', {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
        const orders = await response.json();
        const tbody = document.getElementById('orderTableBody');
        
        if (tbody && Array.isArray(orders)) {
            tbody.innerHTML = orders.map(o => `
                <tr>
                    <td>#${o.id}</td>
                    <td>${o.customerName}</td>
                    <td>${o.items ? o.items.length : 0}</td>
                    <td>₱${o.totalAmount.toFixed(2)}</td>
                    <td><span class="status">${o.status}</span></td>
                    <td>${new Date(o.orderDate).toLocaleDateString()}</td>
                    <td><button onclick="updateStatus(${o.id}, 'Completed')">Done</button></td>
                </tr>
            `).join('');
        }
    } catch (err) {
        console.error("Failed to load orders:", err);
    }
}

async function updateStatus(orderId, status) {
    if (!confirm(`Mark as ${status}?`)) return;
    const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ status: status })
    });
    if (response.ok) fetchOrders();
}
