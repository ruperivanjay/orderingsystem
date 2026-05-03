// Load Products into the 'itemGrid'
async function fetchItems() {
    try {
        const response = await fetch('/api/products', {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
        const items = await response.json();
        const grid = document.getElementById('itemGrid'); // Matches your HTML ID
        
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

// Load Orders into the 'orderTableBody'
async function fetchOrders() {
    try {
        const response = await fetch('/api/orders', {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
        const orders = await response.json();
        const tbody = document.getElementById('orderTableBody'); // Matches your HTML ID
        
        if (tbody && Array.isArray(orders)) {
            tbody.innerHTML = orders.map(o => `
                <tr>
                    <td>#${o.id}</td>
                    <td>${o.customerName}</td>
                    <td>${o.items ? o.items.length : 0}</td>
                    <td>₱${o.totalAmount.toFixed(2)}</td>
                    <td><span class="status-${o.status.toLowerCase()}">${o.status}</span></td>
                    <td>${new Date(o.orderDate).toLocaleDateString()}</td>
                    <td>
                        <button onclick="updateStatus(${o.id}, 'Completed')">Complete</button>
                    </td>
                </tr>
            `).join('');
        }
    } catch (err) {
        console.error("Failed to load orders:", err);
    }
}

// Your existing updateStatus function
async function updateStatus(orderId, status) {
    if (!confirm(`Mark order as ${status}?`)) return;
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
            fetchOrders(); // Refresh table
        } else {
            alert("Failed to update status.");
        }
    } catch (err) { 
        console.error("Update failed:", err); 
    }
}
