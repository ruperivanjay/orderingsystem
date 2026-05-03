// Verification log to ensure the script is running
console.log("order-logic.js has been successfully initialized.");

/**
 * Loads products from the API and populates the item grid.
 * Attached to 'window' to ensure it's globally accessible.
 */
window.fetchItems = async function() {
    console.log("Executing fetchItems...");
    try {
        const response = await fetch('/api/products', {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const items = await response.json();
        const grid = document.getElementById('itemGrid');
        
        if (grid && Array.isArray(items)) {
            grid.innerHTML = items.map(item => `
                <div class="item-card" onclick="addToCart(${item.id})">
                    <strong>${item.name}</strong><br>
                    ₱${item.price.toFixed(2)}
                </div>
            `).join('');
            console.log("Item grid updated.");
        }
    } catch (err) {
        console.error("Failed to load items:", err);
    }
};

/**
 * Loads recent orders from the API and populates the table.
 */
window.fetchOrders = async function() {
    console.log("Executing fetchOrders...");
    try {
        const response = await fetch('/api/orders', {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
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
            console.log("Order table updated.");
        }
    } catch (err) {
        console.error("Failed to load orders:", err);
    }
};

/**
 * Updates the status of an existing order.
 */
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
        
        if (response.ok) {
            window.fetchOrders();
        } else {
            console.error("Failed to update status.");
        }
    } catch (err) {
        console.error("Error updating status:", err);
    }
};
