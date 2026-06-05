from flask import Flask, request, jsonify
from db import connection
from flask_cors import CORS
from whatsapp import send_whatsapp_message

app = Flask(__name__)
CORS(app)

# ----------------------------------------
# API 1: Create User (Admin / Tailor / Customer)
# ----------------------------------------
@app.post("/users")
def create_user():
    data = request.json
    try:
        conn = connection()
        cur = conn.cursor()

        sql = """
            INSERT INTO users (name, mobile, password, role, address)
            VALUES (%s, %s, %s, %s, %s)
        """
        cur.execute(sql, (
            data["name"], data["mobile"], data["password"],
            data["role"], data.get("address")
        ))
        conn.commit()

        return jsonify({"message": "User created successfully"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ----------------------------------------
# API 2: Create Customer Profile
# ----------------------------------------
@app.post("/customers")
def create_customer():
    data = request.json
    try:
        conn = connection()
        cur = conn.cursor()

        sql = """
            INSERT INTO customers (user_id, mobile, address)
            VALUES (%s, %s, %s)
        """
        cur.execute(sql, (
            data["user_id"], data["mobile"], data["address"]
        ))
        conn.commit()

        return jsonify({"message": "Customer added successfully"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ----------------------------------------
# API 3: Add Tailor Specialization
# ----------------------------------------
@app.post("/tailor/specialization")
def add_specialization():
    data = request.json
    try:
        conn = connection()
        cur = conn.cursor()

        sql = """
            INSERT INTO tailor_specializations (tailor_id, specialization)
            VALUES (%s, %s)
        """
        cur.execute(sql, (
            data["tailor_id"], data["specialization"]
        ))
        conn.commit()

        return jsonify({"message": "Specialization added"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ----------------------------------------
# API 4: Add Measurement
# ----------------------------------------
@app.post("/measurements")
def add_measurements():
    data = request.json
    try:
        conn = connection()
        cur = conn.cursor()

        sql = """
            INSERT INTO measurements
            (customer_id, length, waist, hip, chest, shoulder, sleeve, neck, instructions)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)
        """
        cur.execute(sql, (
            data["customer_id"], data["length"], data["waist"], data["hip"],
            data["chest"], data["shoulder"], data["sleeve"],
            data["neck"], data.get("instructions")
        ))
        conn.commit()

        return jsonify({"message": "Measurement added"}), 201

    except Exception as e:
        return jsonify({"error": str(e)})


# ----------------------------------------
# API 5: Create Order
# ----------------------------------------
@app.post("/orders")
def create_order():
    data = request.json
    try:
        conn = connection()
        cur = conn.cursor()

        sql = """
            INSERT INTO orders
            (customer_id, measurement_id, delivery_date, total_amount,
             advance_amount, balance_amount)
            VALUES (%s,%s,%s,%s,%s,%s)
        """
        cur.execute(sql, (
            data["customer_id"], data["measurement_id"],
            data["delivery_date"], data["total_amount"],
            data["advance_amount"], data["balance_amount"]
        ))
        conn.commit()

        return jsonify({"message": "Order created"}), 201

    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500


# ----------------------------------------
# API 6: Add Order Item (Assign Tailor)
# ----------------------------------------
@app.post("/order-items")
def add_order_item():
    data = request.json
    try:
        conn = connection()
        cur = conn.cursor()

        sql = """
            INSERT INTO order_items
            (order_id, item_type, tailor_id, measurement_id,
             stitch_amount, status, notes)
            VALUES (%s,%s,%s,%s,%s,%s,%s)
        """

        cur.execute(sql, (
            data["order_id"], data["item_type"], data["tailor_id"],
            data["measurement_id"], data["stitch_amount"],
            "received", data.get("notes")
        ))
        conn.commit()

        return jsonify({"message": "Order item created"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ----------------------------------------
# API 7: Update Order Item Status
# ----------------------------------------
@app.post("/order-items/status")
def update_item_status():
    data = request.json
    try:
        conn = connection()
        cur = conn.cursor()

        # 1. Update item status
        cur.execute(
            "UPDATE order_items SET status=%s WHERE id=%s",
            (data["status"], data["order_item_id"])
        )

        # 2. Insert status history
        cur.execute("""
            INSERT INTO order_status_history (order_item_id, status, updated_by)
            VALUES (%s, %s, %s)
        """, (
            data["order_item_id"], data["status"], data["updated_by"]
        ))

        # 3. Get order_id
        cur.execute(
            "SELECT order_id FROM order_items WHERE id=%s",
            (data["order_item_id"],)
        )
        order_id = cur.fetchone()[0]

        # 4. Auto update order status
        recalculate_order_status(cur, order_id)

        # ✅ MOST IMPORTANT
        conn.commit()

        return jsonify({"message": "Status updated successfully"})

    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500

    finally:
        cur.close()
        conn.close()


# ----------------------------------------
# API 8: Add Payment
# ----------------------------------------
@app.post("/payments")
def add_payment():
    data = request.json
    try:
        conn = connection()
        cur = conn.cursor()

        sql = """
            INSERT INTO payments (order_id, amount, payment_type)
            VALUES (%s, %s, %s)
        """
        cur.execute(sql, (
            data["order_id"], data["amount"], data["payment_type"]
        ))
        conn.commit()

        return jsonify({"message": "Payment added"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.post("/login")
def login():
    data = request.json
    mobile = data.get("mobile")
    password = data.get("password")

    try:
        conn = connection()
        cur = conn.cursor(dictionary=True)

        sql = """
            SELECT id, name, mobile, role
            FROM users
            WHERE mobile=%s AND password=%s
        """
        cur.execute(sql, (mobile, password))
        user = cur.fetchone()

        if not user:
            return jsonify({"success": False, "message": "Invalid credentials"}), 401

        return jsonify({
            "success": True,
            "message": "Login successful",
            "user": user
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    
@app.get("/tailors")
def get_tailors():
    try:
        conn = connection()
        cur = conn.cursor(dictionary=True)

        cur.execute("SELECT id, name, mobile FROM users WHERE role='tailor'")
        tailors = cur.fetchall()

        return jsonify({"tailors": tailors})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.get("/users/customers")
def get_customer_users():
    try:
        conn = connection()
        cur = conn.cursor(dictionary=True)

        cur.execute("SELECT id, name, mobile FROM users WHERE role='customer'")
        rows = cur.fetchall()

        return jsonify(rows)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.get("/customers")
def get_customers():
    try:
        conn = connection()
        cur = conn.cursor(dictionary=True)

        sql = """
            SELECT c.id, u.name, u.mobile AS user_mobile,
                   c.mobile AS customer_mobile, c.address
            FROM customers c
            JOIN users u ON c.user_id = u.id
        """
        cur.execute(sql)
        rows = cur.fetchall()

        return jsonify(rows)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.get("/customers/<int:id>")
def get_customer(id):
    try:
        conn = connection()
        cur = conn.cursor(dictionary=True)

        sql = """
            SELECT c.id, c.user_id, u.name, u.mobile AS user_mobile,
                   c.mobile AS customer_mobile, c.address
            FROM customers c
            JOIN users u ON c.user_id = u.id
            WHERE c.id=%s
        """
        cur.execute(sql, (id,))
        row = cur.fetchone()

        return jsonify(row)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
@app.put("/customers/<int:id>")
def update_customer(id):
    data = request.json
    try:
        conn = connection()
        cur = conn.cursor()

        sql = """
            UPDATE customers
            SET mobile=%s, address=%s
            WHERE id=%s
        """
        cur.execute(sql, (data["mobile"], data["address"], id))
        conn.commit()

        return jsonify({"message": "Customer updated"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
@app.delete("/customers/<int:id>")
def delete_customer(id):
    try:
        conn = connection()
        cur = conn.cursor()

        cur.execute("DELETE FROM customers WHERE id=%s", (id,))
        conn.commit()

        return jsonify({"message": "Customer deleted"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.get("/measurements")
def get_measurements():
    try:
        conn = connection()
        cur = conn.cursor(dictionary=True)

        sql = """
            SELECT m.*, u.name AS customer_name
            FROM measurements m
            JOIN customers c ON m.customer_id = c.id
            JOIN users u ON c.user_id = u.id
            ORDER BY m.id DESC
        """

        cur.execute(sql)
        rows = cur.fetchall()

        return jsonify(rows)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.get("/measurements/<int:id>")
def get_measurement(id):
    try:
        conn = connection()
        cur = conn.cursor(dictionary=True)

        sql = """
            SELECT m.*, u.name AS customer_name
            FROM measurements m
            JOIN customers c ON m.customer_id = c.id
            JOIN users u ON c.user_id = u.id
            WHERE m.id = %s
        """

        cur.execute(sql, (id,))
        row = cur.fetchone()

        return jsonify(row)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.get("/measurements/by-customer/<int:customer_id>")
def get_measurements_by_customer(customer_id):
    conn = connection()
    cur = conn.cursor(dictionary=True)
    cur.execute("""
        SELECT * FROM measurements WHERE customer_id = %s
    """, (customer_id,))
    return cur.fetchall()

@app.get("/orders/by-customer/<int:customer_id>")
def orders_by_customer(customer_id):
    conn = connection()
    cur = conn.cursor(dictionary=True)
    cur.execute("SELECT * FROM orders WHERE customer_id=%s", (customer_id,))
    return cur.fetchall()

@app.get("/orders/<int:order_id>")
def get_order(order_id):
    conn = connection()
    cur = conn.cursor(dictionary=True)
    cur.execute("SELECT * FROM orders WHERE id=%s", (order_id,))
    return cur.fetchone()

@app.get("/tailors/by-specialization/<string:item>")
def get_tailors_by_specialization(item):
    conn = connection()
    cur = conn.cursor(dictionary=True)
    cur.execute("""
        SELECT u.id, u.name, u.mobile 
        FROM users u
        JOIN tailor_specializations t ON t.tailor_id = u.id
        WHERE t.specialization = %s
    """, (item,))
    return cur.fetchall()

@app.get("/orders")
def get_orders():
    try:
        conn = connection()
        cur = conn.cursor(dictionary=True)

        sql = """
            SELECT 
                o.*,
                u.name AS customer_name,
                GROUP_CONCAT(DISTINCT t.name) AS tailor_names
            FROM orders o
            LEFT JOIN customers c ON o.customer_id = c.id
            LEFT JOIN users u ON c.user_id = u.id
            LEFT JOIN order_items oi ON oi.order_id = o.id
            LEFT JOIN users t ON oi.tailor_id = t.id
            GROUP BY o.id
            ORDER BY o.id DESC
        """

        cur.execute(sql)
        result = cur.fetchall()

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.get("/tailor/orders/<int:tailor_id>")
def get_tailor_orders(tailor_id):
    try:
        conn = connection()
        cur = conn.cursor(dictionary=True)

        sql = """
            SELECT 
                oi.id AS order_item_id,
                oi.item_type,
                oi.status,
                oi.stitch_amount,
                o.delivery_date,
                u.name AS customer_name,

                m.length, m.waist, m.hip, m.chest,
                m.shoulder, m.sleeve, m.neck,
                m.instructions

            FROM order_items oi
            JOIN orders o ON oi.order_id = o.id
            JOIN customers c ON o.customer_id = c.id
            JOIN users u ON c.user_id = u.id
            JOIN measurements m ON oi.measurement_id = m.id
            WHERE oi.tailor_id = %s
            ORDER BY o.delivery_date
        """

        cur.execute(sql, (tailor_id,))
        data = cur.fetchall()
        return jsonify(data)

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
def recalculate_order_status(order_id):
    conn = connection()
    cur = conn.cursor()

    cur.execute(
        "SELECT status FROM order_items WHERE order_id=%s",
        (order_id,)
    )
    statuses = [row[0] for row in cur.fetchall()]

    if all(s == "delivered" for s in statuses):
        new_status = "delivered"
    elif all(s == "ready" for s in statuses):
        new_status = "completed"
    elif any(s in ["cutting","stitching","trial"] for s in statuses):
        new_status = "in_progress"
    else:
        new_status = "received"

    cur.execute(
        "UPDATE orders SET status=%s WHERE id=%s",
        (new_status, order_id)
    )
    conn.commit()
    
@app.get("/admin/order-details/<int:order_id>")
def admin_order_details(order_id):
    try:
        conn = connection()
        cur = conn.cursor(dictionary=True)

        sql = """
            SELECT 
                oi.id,
                oi.item_type,
                oi.status,
                u.name AS tailor_name,
                oi.stitch_amount
            FROM order_items oi
            JOIN users u ON oi.tailor_id = u.id
            WHERE oi.order_id = %s
        """

        cur.execute(sql, (order_id,))
        items = cur.fetchall()

        return jsonify(items)

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.get("/orders/<int:order_id>/items")
def get_order_items(order_id):
    try:
        conn = connection()
        cur = conn.cursor(dictionary=True)

        cur.execute("""
            SELECT 
                oi.id AS order_item_id,
                oi.item_type,
                oi.status,
                oi.notes AS instructions,
                u.name AS tailor_name
            FROM order_items oi
            LEFT JOIN users u ON oi.tailor_id = u.id
            WHERE oi.order_id = %s
        """, (order_id,))

        items = cur.fetchall()
        return jsonify(items)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.get("/customer/orders/<int:user_id>")
def get_customer_orders(user_id):
    try:
        conn = connection()
        cur = conn.cursor(dictionary=True)

        sql = """
            SELECT 
                o.id,
                o.delivery_date,
                o.status
            FROM orders o
            JOIN customers c ON o.customer_id = c.id
            WHERE c.user_id = %s
            ORDER BY o.created_at DESC
        """
        cur.execute(sql, (user_id,))
        orders = cur.fetchall()

        return jsonify(orders)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        cur.close()
        conn.close()


@app.get("/customer/by-user/<int:user_id>")
def get_customer_by_user(user_id):
    try:
        conn = connection()
        cur = conn.cursor(dictionary=True)

        cur.execute(
            "SELECT id FROM customers WHERE user_id = %s",
            (user_id,)
        )
        customer = cur.fetchone()

        return jsonify(customer), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500





def recalculate_order_status(cur, order_id):
    """
    Recalculate order status based on order_items status
    and send WhatsApp when order becomes COMPLETED
    """

    # 1️⃣ Get all item statuses
    cur.execute(
        "SELECT status FROM order_items WHERE order_id=%s",
        (order_id,)
    )
    rows = cur.fetchall()

    if not rows:
        return

    statuses = [row[0] for row in rows]

    # 2️⃣ Decide order status
    if all(s == "delivered" for s in statuses):
        order_status = "delivered"

    elif all(s in ("ready", "delivered") for s in statuses):
        order_status = "completed"

    else:
        order_status = "in_progress"

    # 3️⃣ Get previous order status
    cur.execute(
        "SELECT status FROM orders WHERE id=%s",
        (order_id,)
    )
    previous_status = cur.fetchone()[0]

    # 4️⃣ Update order status
    cur.execute(
        "UPDATE orders SET status=%s WHERE id=%s",
        (order_status, order_id)
    )

    # 5️⃣ Send WhatsApp ONLY when status changes to COMPLETED
    if order_status == "completed" and previous_status != "completed":

        cur.execute("""
            SELECT 
                o.id,
                o.total_amount,
                o.advance_amount,
                o.balance_amount,
                u.name AS customer_name,
                u.mobile
            FROM orders o
            JOIN customers c ON o.customer_id = c.id
            JOIN users u ON c.user_id = u.id
            WHERE o.id=%s
        """, (order_id,))

        order = cur.fetchone()

        if order:
            message = f"""
Hello {order[4]} 👋

🎉 Your tailoring order #{order[0]} is READY!

💰 Total Amount: ₹{order[1]}
💵 Advance Paid: ₹{order[2]}
⚠ Balance Amount: ₹{order[3]}

📍 Please visit our shop to collect your dress.

Thank you 🙏
– Tailor App
"""

            send_whatsapp_message(order[5], message)



@app.get("/test-whatsapp")
def test_whatsapp():
    send_whatsapp_message(
        "9886182081",   # your registered number
        "Hello 👋 This is a test WhatsApp message from Tailor App"
    )
    return {"message": "WhatsApp sent"}


@app.post("/orders/billing")
def update_billing():
    data = request.json
    try:
        conn = connection()
        cur = conn.cursor()

        total = float(data["total_amount"])
        advance = float(data["advance_amount"])
        balance = total - advance

        cur.execute("""
            UPDATE orders
            SET total_amount=%s,
                advance_amount=%s,
                balance_amount=%s
            WHERE id=%s
        """, (total, advance, balance, data["order_id"]))

        conn.commit()
        return jsonify({"message": "Billing updated", "balance": balance})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    





if __name__ == "__main__":
    app.run(debug=True,port=5001)
