// 1. Load Products
async function fetchItems() {
    try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        const items = await response.json();
        const grid = document.getElementById('productGrid');
        
        if (grid) {
            grid.innerHTML = items.map(item => `
                <div class="item-card" onclick="addToCart(${item.id})">
                    <strong>${item.name}</strong><br>
                    ₱${item.price.toFixed(2)}
                </div>
            `).join('');
        }
    } catch (err) {
        console.error("Failed to fetch items:", err);
    }
}

// 2. Load Orders (Fixes ReferenceError in image_fbd99d.jpg)
async function fetchOrders() {
    try {
        const response = await fetch('/api/orders');
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        const orders = await response.json();
        const tbody = document.getElementById('orderTableBody');
        
        if (tbody) {
            tbody.innerHTML = orders.map(o => `
                <tr>
                    <td>#${o.id}</td>
                    <td>${o.customerName}</td>
                    <td>₱${o.totalAmount.toFixed(2)}</td>
                    <td><span class="badge">${o.status}</span></td>
                </tr>
            `).join('');
        }
    } catch (err) {
        console.error("Failed to fetch orders:", err);
    }
}

// 3. Initialize after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    fetchItems();
    fetchOrders();
});
