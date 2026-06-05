from mysql.connector import connect, Error
def connection():
    try:
        conn = connect(
            host="127.0.0.1",
            user="root",
            password="1234",
            database="tailorfinal"
        )
        return conn
    except Error as e:
        print(f"Error connecting to database: {e}")
        return None
    