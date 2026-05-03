// Function to load products/items
async function fetchItems() {
    try {
        const response = await fetch('/api/products'); // Adjust URL if different
        const items = await response.json();
        const grid = document.querySelector('.item-grid');
        
        grid.innerHTML = items.map(item => `
            <div class="item-card ${item.stock <= 0 ? 'out-of-stock' : ''}" onclick="addToCart(${item.id})">
                <span class="item-name"><strong>${item.name}</strong></span>
                <span class="item-price">₱${item.price.toFixed(2)}</span>
                <span class="item-stock">Stock: ${item.stock}</span>
            </div>
        `).join('');
    } catch (err) {
        console.error("Error loading items:", err);
    }
}

// Function to update order status (Fix for "CANCELLED")
async function updateStatus(orderId, status) {
    if (!confirm(`Mark order as ${status}?`)) return;
    try {
        const response = await fetch(`/api/orders/${orderId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: status }) 
        });
        
        if (response.ok) fetchOrders();
    } catch (err) { 
        console.error("Status update failed:", err); 
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    fetchItems();  // This fixes the ReferenceError
    fetchOrders();
});
