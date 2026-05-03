// This confirms the file actually loaded
console.log("order-logic.js is active");

// Use window. to make fetchItems visible globally
window.fetchItems = async function() {
    console.log("fetchItems called");
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
            console.log("Products loaded into grid");
        }
    } catch (err) {
        console.error("Failed to load items:", err);
    }
}

// Use window. to make fetchOrders visible globally
window.fetchOrders = async function() {
    console.log("fetchOrders called");
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
            console.log("Orders loaded into table");
        }
    } catch (err) {
        console.error("Failed to load orders:", err);
    }
}

// Use window. to make updateStatus visible globally
window.updateStatus = async function(orderId, status) {
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
