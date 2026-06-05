import os
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas

INVOICE_DIR = "invoices"

def generate_invoice(order, items):
    """
    order = (id, total, advance, balance, customer_name, mobile)
    items = [{ "item": "Shirt Stitching", "price": 500 }]
    """

    if not os.path.exists(INVOICE_DIR):
        os.makedirs(INVOICE_DIR)

    file_path = f"{INVOICE_DIR}/invoice_{order[0]}.pdf"

    c = canvas.Canvas(file_path, pagesize=A4)
    width, height = A4

    # ---------------- HEADER ----------------
    c.setFont("Helvetica-Bold", 18)
    c.drawCentredString(width / 2, height - 50, "SMART TAILOR - INVOICE")

    c.setFont("Helvetica", 12)
    y = height - 120

    # ---------------- CUSTOMER DETAILS ----------------
    c.drawString(50, y, f"Invoice No : {order[0]}")
    y -= 20
    c.drawString(50, y, f"Customer Name : {order[4]}")
    y -= 20
    c.drawString(50, y, f"Mobile : {order[5]}")
    y -= 30

    # ---------------- TABLE HEADER ----------------
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, y, "Sl No")
    c.drawString(100, y, "Item Description")
    c.drawRightString(520, y, "Amount (₹)")
    y -= 10
    c.line(50, y, 550, y)
    y -= 20

    # ---------------- ITEMS ----------------
    c.setFont("Helvetica", 12)
    for idx, item in enumerate(items, start=1):
        c.drawString(50, y, str(idx))
        c.drawString(100, y, item["item"])
        c.drawRightString(520, y, str(item["price"]))
        y -= 20

        if y < 150:
            c.showPage()
            y = height - 100

    # ---------------- TOTALS ----------------
    y -= 10
    c.line(50, y, 550, y)
    y -= 25

    c.setFont("Helvetica-Bold", 12)
    c.drawRightString(520, y, f"Total Amount : ₹ {order[1]}")
    y -= 20
    c.drawRightString(520, y, f"Advance Paid : ₹ {order[2]}")
    y -= 20
    c.drawRightString(520, y, f"Balance Amount : ₹ {order[3]}")

    # ---------------- FOOTER ----------------
    c.setFont("Helvetica", 10)
    c.drawString(50, 80, "Thank you for choosing Smart Tailor 🙏")
    c.drawString(50, 60, "Visit Again!")

    c.showPage()
    c.save()

    return file_path
