# Udatracker Starter Code

This directory contains the starter code for the Udatracker project. The initial structure of directories and files is described below.

```
.
├── backend
│   ├── __init__.py
│   ├── app.py
│   ├── in_memory_storage.py
│   ├── order_tracker.py
│   ├── requirements.txt
│   └── tests
│       ├── __init__.py
│       ├── test_api.py
│       └── test_order_tracker.py
├── frontend
│   ├── css
│   │   └── style.css
│   ├── index.html
│   └── js
│       └── script.js
├── pytest.ini
└── README.md
```
## My Implementation

The starter project has been extended into a functional Order Management System.

### Implemented Features
- Add new orders
- Retrieve order details
- Update order status
- View all orders
- Filter orders by status
- Delete orders with confirmation
- SQLite database integration for persistent storage
- Input validation and error handling

### Technologies Used
- Frontend: HTML, CSS, JavaScript
- Backend: Python, Flask
- Database: SQLite
- Testing: Pytest

### Testing

Run the tests using:

python -m pytest -v

All 16 tests are passing.

### Updated Project Structure

The implementation also includes:

- backend/sqlite_storage.py
- backend/orders.db
