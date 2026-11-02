# This module contains the OrderTracker class, which encapsulates the core
# business logic for managing orders.

class OrderTracker:
    """
    Manages customer orders, providing functionalities to add, update,
    and retrieve order information.
    """

    VALID_STATUSES = {
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled"
    }

    def __init__(self, storage):
        required_methods = [
    'save_order',
    'get_order',
    'get_all_orders',
    'delete_order'
                ]
        

        for method in required_methods:
            if not hasattr(storage, method) or not callable(getattr(storage, method)):
                raise TypeError(
                    f"Storage object must implement a callable '{method}' method."
                )

        self.storage = storage

    def add_order(
        self,
        order_id: str,
        item_name: str,
        quantity: int,
        customer_id: str,
        status: str = "pending"
    ):
        # Validate required string fields.
        if not isinstance(order_id, str) or not order_id.strip():
            raise ValueError("Order ID must be a non-empty string.")

        if not isinstance(item_name, str) or not item_name.strip():
            raise ValueError("Item name must be a non-empty string.")

        if not isinstance(customer_id, str) or not customer_id.strip():
            raise ValueError("Customer ID must be a non-empty string.")

        # Quantity must be a positive integer, not a boolean.
        if isinstance(quantity, bool) or not isinstance(quantity, int) or quantity <= 0:
            raise ValueError("Quantity must be a positive integer.")

        # Validate the order status.
        if not isinstance(status, str) or status not in self.VALID_STATUSES:
            raise ValueError("Invalid order status.")

        # Prevent duplicate order IDs.
        if self.storage.get_order(order_id) is not None:
            raise ValueError(f"Order with ID '{order_id}' already exists.")

        # Create the order.
        order = {
            "order_id": order_id,
            "item_name": item_name,
            "quantity": quantity,
            "customer_id": customer_id,
            "status": status
        }

        # Save the order.
        self.storage.save_order(order_id, order)

        return order.copy()

    def get_order_by_id(self, order_id: str):
        if not isinstance(order_id, str) or not order_id.strip():
            raise ValueError("Order ID must be a non-empty string.")

        return self.storage.get_order(order_id)

    def update_order_status(self, order_id: str, new_status: str):
        if not isinstance(order_id, str) or not order_id.strip():
            raise ValueError("Order ID must be a non-empty string.")

        # Validate status before accessing storage.
        if not isinstance(new_status, str) or new_status not in self.VALID_STATUSES:
            raise ValueError("Invalid order status.")

        order = self.storage.get_order(order_id)

        if order is None:
            raise ValueError(f"Order with ID '{order_id}' not found.")

        # Create a copy to avoid modifying the original dictionary.
        updated_order = order.copy()
        updated_order["status"] = new_status

        self.storage.save_order(order_id, updated_order)

        return updated_order.copy()

    def list_all_orders(self):
        orders = self.storage.get_all_orders()

        return list(orders.values())

    def list_orders_by_status(self, status: str):
        if not isinstance(status, str) or status not in self.VALID_STATUSES:
            raise ValueError("Invalid order status.")

        orders = self.storage.get_all_orders()

        return [
            order
            for order in orders.values()
            if order["status"] == status
        ]
    def delete_order(self, order_id: str):
        if not isinstance(order_id, str) or not order_id.strip():
            raise ValueError("Order ID must be a non-empty string.")

        order = self.storage.get_order(order_id)

        if order is None:
            raise ValueError(f"Order with ID '{order_id}' not found.")

        self.storage.delete_order(order_id)

        return order