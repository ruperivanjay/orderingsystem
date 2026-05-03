// This confirms the file is actually being read by the browser
console.log("order-logic.js: Script is loaded and running.");

window.fetchItems = async function() {
    console.log("order-logic.js: fetchItems() called.");
    try {
        const response = await fetch('/api/products', {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
        
        if (!response.ok) throw new Error("Server error: " + response.status);
        
        const items = await response.json();
        const grid = document.getElementById('itemGrid');
        
        if (grid && Array.isArray(items)) {
            grid.innerHTML = items.map(item => `
                <div class="item-card" onclick="addToCart(${item.id})">
                    <strong>${item.name}</strong><br>
                    ₱${item.price.toFixed(2)}
                </div>
            `).join('');
            console.log("order-logic.js: Products rendered.");
        }
    } catch (err) {
        console.error("order-logic.js: fetchItems Error ->", err);
    }
};

window.fetchOrders = async function() {
    console.log("order-logic.js: fetchOrders() called.");
    try {
        const response = await fetch('/api/orders', {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
        
        if (!response.ok) throw new Error("Server error: " + response.status);
        
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
            console.log("order-logic.js: Orders rendered.");
        }
    } catch (err) {
        console.error("order-logic.js: fetchOrders Error ->", err);
    }
};

window.updateStatus = async function(orderId, status) {
    if (!confirm(`Mark order #${orderId} as ${status}?`)) return;
    try {
        const response = await fetch(`/api/orders/${orderId}/status`, {
            method: 'PUT',
            headers: { 
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ status: status })
        });
        if (response.ok) window.fetchOrders();
    } catch (err) {
        console.error("order-logic.js: updateStatus Error ->", err);
    }
};
