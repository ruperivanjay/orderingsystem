// 1. Fetch Products
async function fetchItems() {
    try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Failed to load products');
        const items = await response.json();
        const grid = document.getElementById('productGrid');
        
        grid.innerHTML = items.map(item => `
            <div class="item-card" onclick="addToCart(${item.id})">
                <strong>${item.name}</strong><br>
                ₱${item.price.toFixed(2)}
            </div>
        `).join('');
    } catch (err) { console.error(err); }
}

// 2. Fetch Orders (This fixes the ReferenceError)
async function fetchOrders() {
    try {
        const response = await fetch('/api/orders');
        const orders = await response.json();
        const tbody = document.getElementById('orderTableBody');
        
        tbody.innerHTML = orders.map(o => `
            <tr>
                <td>#${o.id}</td>
                <td>${o.customerName}</td>
                <td>₱${o.totalAmount.toFixed(2)}</td>
                <td>${o.status}</td>
            </tr>
        `).join('');
    } catch (err) { console.error(err); }
}

// 3. Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchItems();
    fetchOrders(); 
});
