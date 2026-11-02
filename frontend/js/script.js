document.addEventListener('DOMContentLoaded', () => {
    const messageContainer = document.getElementById('message-container');
    const addOrderForm = document.getElementById('add-order-form');
    const getOrderForm = document.getElementById('get-order-form');
    const singleOrderDetails = document.getElementById('single-order-details');
    const updateStatusForm = document.getElementById('update-status-form');
    const listAllOrdersBtn = document.getElementById('list-all-orders-btn');
    const filterStatusSelect = document.getElementById('filter-status');
    const ordersTableBody = document.getElementById('orders-table-body');

    function showMessage(message, type) {
        messageContainer.textContent = message;
        messageContainer.className = `message-box ${type === 'success' ? 'message-success' : 'message-error'}`;
        messageContainer.classList.remove('hidden');
        setTimeout(() => messageContainer.classList.add('hidden'), 5000);
    }
    function renderOrdersTable(orders) {
    ordersTableBody.innerHTML = '';

    if (orders.length === 0) {
        ordersTableBody.innerHTML =
            '<tr><td colspan="6" class="text-center py-4">No orders to display.</td></tr>';
        return;
    }

    orders.forEach(order => {
        const row = document.createElement('tr');

        const values = [
            order.order_id,
            order.item_name,
            order.quantity,
            order.customer_id,
            order.status
        ];

        values.forEach((value, index) => {
            const cell = document.createElement('td');
            cell.className = 'p-2';

            if (index === 4) {
                cell.classList.add('capitalize');
            }

            if (index === 4) {
                const statusBadge = document.createElement('span');
                statusBadge.textContent = value;
                statusBadge.className = `status-badge status-${value}`;
                cell.appendChild(statusBadge);
            } else {
                cell.textContent = value;
            }

            row.appendChild(cell);
        });

        // Create Delete button
        const actionCell = document.createElement('td');
        actionCell.className = 'p-2';

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-btn';

        deleteButton.addEventListener('click', async () => {
            const confirmDelete = confirm(
                `Are you sure you want to delete order ${order.order_id}?`
            );

            if (!confirmDelete) return;

            try {
                const response = await fetch(
                    `/api/orders/${encodeURIComponent(order.order_id)}`,
                    { method: 'DELETE' }
                );

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || 'Unable to delete order');
                }

                showMessage(
                    `Order ${order.order_id} deleted successfully!`,
                    'success'
                );

                fetchAndRenderOrders(filterStatusSelect.value);
            } catch (error) {
                showMessage(`Failed to delete order: ${error.message}`, 'error');
            }
        });

        actionCell.appendChild(deleteButton);
        row.appendChild(actionCell);

        ordersTableBody.appendChild(row);
    });
}

    
    async function fetchAndRenderOrders(status = '') {
        try {
            const url = status ? `/api/orders?status=${status}` : '/api/orders';
            const response = await fetch(url);
            const orders = await response.json();
            if (!response.ok) throw new Error(orders.error || 'Unknown error');
            renderOrdersTable(orders);
        } catch (error) { showMessage(`Failed to load orders: ${error.message}`, 'error'); renderOrdersTable([]); }
    }

    addOrderForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(addOrderForm);
        const orderData = Object.fromEntries(formData.entries());
        orderData.quantity = parseInt(orderData.quantity);
        try {
            const response = await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(orderData) });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error);
            showMessage(`Order ${result.order_id} added!`, 'success');
            addOrderForm.reset();
            fetchAndRenderOrders();
        } catch (error) { showMessage(`Failed to add order: ${error.message}`, 'error'); }
    });

    getOrderForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const orderId = document.getElementById('get-order-id').value.trim();
        singleOrderDetails.classList.add('hidden');
        if (!orderId) { showMessage('Please enter an Order ID.', 'error'); return; }
        try {
            const response = await fetch(`/api/orders/${orderId}`);
            const order = await response.json();
            if (!response.ok) throw new Error(order.error);
            singleOrderDetails.querySelector('pre').textContent = JSON.stringify(order, null, 2);
            singleOrderDetails.classList.remove('hidden');
        } catch (error) { showMessage(`Failed to get order: ${error.message}`, 'error'); }
    });

    updateStatusForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const orderId = document.getElementById('update-order-id').value.trim();
        const newStatus = document.getElementById('update-new-status').value;
        if (!orderId || !newStatus) { showMessage('Please enter an Order ID and select a new status.', 'error'); return; }
        try {
            const response = await fetch(`/api/orders/${orderId}/status`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ new_status: newStatus }) });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error);
            showMessage(`Order ${orderId} status updated.`, 'success');
            updateStatusForm.reset();
            fetchAndRenderOrders();
        } catch (error) { showMessage(`Failed to update status: ${error.message}`, 'error'); }
    });

    listAllOrdersBtn.addEventListener('click', () => { filterStatusSelect.value = ''; fetchAndRenderOrders(); });
    filterStatusSelect.addEventListener('change', (e) => fetchAndRenderOrders(e.target.value));
    fetchAndRenderOrders();
});
