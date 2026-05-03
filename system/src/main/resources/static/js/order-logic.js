// Function to load products
async function fetchItems() {
    try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('404 Not Found');
        const items = await response.json();
        renderProducts(items);
    } catch (err) {
        console.error("Products failed to load:", err);
    }
}

// Function to load orders (This fixes the "not defined" error)
async function fetchOrders() {
    try {
        const response = await fetch('/api/orders');
        const orders = await response.json();
        renderOrders(orders);
    } catch (err) {
        console.error("Orders failed to load:", err);
    }
}

// Single initialization point
document.addEventListener('DOMContentLoaded', () => {
    fetchItems();
    fetchOrders();
});
