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
        }
    } catch (err) { 
        console.error("Update failed:", err); 
    }
}

function fetchOrders() {
    fetch('/api/orders', {
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
    })
    .then(res => res.json())
    .then(orders => {
        const tbody = document.getElementById('orderTableBody');
        tbody.innerHTML = orders.map(o => `
            <tr>
                <td>#${o.id}</td>
                <td><span class="badge badge-${(o.status || 'PENDING').toLowerCase()}">${o.status}</span></td>
                <td>
                    <div class="action-buttons">
                        ${o.status === 'PENDING' ? `
                            <button class="btn-complete" onclick="updateStatus(${o.id}, 'COMPLETED')">Done</button>
                            <button class="btn-cancel" onclick="updateStatus(${o.id}, 'CANCELLED')">Cancel</button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `).join('');
    });
}
