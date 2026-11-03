# Order Management System

This project is an Order Management System developed using Python, Flask, SQLite, HTML, CSS, and JavaScript. The project structure is described below.

```
.
├── backend
│   ├── __init__.py
│   ├── app.py
│   ├── in_memory_storage.py
│   ├── order_tracker.py
│   ├── requirements.txt
│   ├── sqlite_storage.py
│   ├── orders.db
│   └── tests
│       ├── __init__.py
│       ├── test_api.py
│       └── test_order_tracker.py
├── frontend
│   ├── css
│   │   └── style.css
│   ├── index.html
│   └── js
│       └── script.js
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

All 17 tests are passing.

### Reflection

- **Design decision:** I chose SQLite for persistent storage so that order details remain available after the application restarts. I also kept InMemoryStorage as a separate implementation for testing. OrderTracker checks that the storage class implements all required methods, including delete_order(), so both storage implementations follow the same contract.
- **Testing insight:** I learned that API tests should use fresh in-memory storage instead of clearing the application's actual SQLite database. I also added a unit test to verify how get_order_by_id() behaves when an order does not exist.
- **Future improvement:** I would improve API error handling by returning more specific HTTP status codes and add pagination when displaying large numbers of orders.

### Updated Project Structure

The implementation also includes:

- `backend/sqlite_storage.py` - SQLite database storage implementation.
- `backend/orders.db` - SQLite database file for persistent order storage.



