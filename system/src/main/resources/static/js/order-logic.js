// Load products into the "Select Items" grid
async function fetchItems() {
    try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Network response was not ok');
        
        const items = await response.json();
        const grid = document.getElementById('productGrid');
        
        if (Array.isArray(items)) {
            grid.innerHTML = items.map(item => `
                <div class="item-card" onclick="addToCart(${item.id}, '${item.name}', ${item.price})">
                    <strong>${item.name}</strong><br>
                    ₱${item.price.toFixed(2)}
                </div>
            `).join('');
        }
    } catch (err) {
        console.error("Error loading items:", err);
    }
}

// Load existing orders into the table
async function fetchOrders() {
    try {
        const response = await fetch('/api/orders');
        const orders = await response.json();
        const tbody = document.getElementById('orderTableBody');
        
        tbody.innerHTML = orders.map(o => `
            <tr>
                <td>#${o.id}</td>
                <td>${o.customerName}</td>
                <td>${o.items}</td>
                <td>₱${o.totalAmount.toFixed(2)}</td>
                <td><span class="badge badge-${o.status.toLowerCase()}">${o.status}</span></td>
                <td>
                    ${o.status === 'PENDING' ? `
                        <button onclick="updateStatus(${o.id}, 'COMPLETED')">Done</button>
                        <button onclick="updateStatus(${o.id}, 'CANCELLED')">Cancel</button>
                    ` : ''}
                </td>
            </tr>
        `).join('');
    } catch (err) {
        console.error("Error loading orders:", err);
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchItems();
    fetchOrders(); // This prevents the "not defined" error
});
