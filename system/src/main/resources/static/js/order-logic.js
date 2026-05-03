// Add this log at the very top to verify the file is active
console.log("LOGIC LOADED: order-logic.js is active");

window.fetchItems = async function() {
    console.log("Executing fetchItems...");
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
        console.error("fetchItems failed:", err);
    }
};

window.fetchOrders = async function() {
    // ... apply the same 'window.' prefix to fetchOrders ...
};
