async function updateStatus(orderId, status) {
    if (!confirm(`Mark order as ${status}?`)) return;
    try {
        const response = await fetch(`/api/orders/${orderId}/status`, {
            method: 'PUT',
            headers: { 
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ status: status }) // Sending as JSON body
        });
        
        if (response.ok) {
            fetchOrders();
        } else {
            alert("Failed to update status.");
        }
    } catch (err) { 
        console.error("Update failed:", err); 
    }
}
