import sqlite3


class SQLiteStorage:

    def __init__(self, db_name="backend/orders.db"):
        self.db_name = db_name
        self.create_table()

    def get_connection(self):
        connection = sqlite3.connect(self.db_name, timeout=10)
        return connection

    def create_table(self):
        with self.get_connection() as connection:
            connection.execute("""
                CREATE TABLE IF NOT EXISTS orders (
                    order_id TEXT PRIMARY KEY,
                    item_name TEXT NOT NULL,
                    quantity INTEGER NOT NULL,
                    customer_id TEXT NOT NULL,
                    status TEXT NOT NULL
                )
            """)

    def save_order(self, order_id, order_data):
        with self.get_connection() as connection:
            connection.execute("""
                INSERT OR REPLACE INTO orders
                (order_id, item_name, quantity, customer_id, status)
                VALUES (?, ?, ?, ?, ?)
            """, (
                order_id,
                order_data["item_name"],
                order_data["quantity"],
                order_data["customer_id"],
                order_data["status"]
            ))

    def get_order(self, order_id):
        with self.get_connection() as connection:
            row = connection.execute(
                "SELECT * FROM orders WHERE order_id = ?",
                (order_id,)
            ).fetchone()

        if row is None:
            return None

        return {
            "order_id": row[0],
            "item_name": row[1],
            "quantity": row[2],
            "customer_id": row[3],
            "status": row[4]
        }

    def get_all_orders(self):
        with self.get_connection() as connection:
            rows = connection.execute(
                "SELECT * FROM orders"
            ).fetchall()

        return {
            row[0]: {
                "order_id": row[0],
                "item_name": row[1],
                "quantity": row[2],
                "customer_id": row[3],
                "status": row[4]
            }
            for row in rows
        }

    def clear(self):
        with self.get_connection() as connection:
            connection.execute("DELETE FROM orders")

    def delete_order(self, order_id):
        with self.get_connection() as connection:
            connection.execute(
                "DELETE FROM orders WHERE order_id = ?",
                (order_id,)
            )
