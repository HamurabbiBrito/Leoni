import os
import bcrypt
import psycopg2
from dotenv import load_dotenv

load_dotenv()  # Carga variables de .env.local

# Configuración de la base de datos (usa las mismas variables que en db.js)
conn = psycopg2.connect(
    dbname=os.getenv('DB_NAME'),
    user=os.getenv('DB_USER'),
    password=os.getenv('DB_PASSWORD'),
    host=os.getenv('DB_HOST'),
    port=os.getenv('DB_PORT', 5432)
)

def migrate_passwords():
    try:
        cursor = conn.cursor()
        
        # 1. Obtener usuarios con contraseñas sin hashear
        cursor.execute("SELECT id_usuario, password FROM \"Usuarios\" WHERE password NOT LIKE '$2b$%'")
        users = cursor.fetchall()
        
        if not users:
            print("✅ Todas las contraseñas ya están hasheadas")
            return
        
        print(f"🔄 Encontrados {len(users)} usuarios para actualizar")
        
        # 2. Hashear y actualizar
        for (id_usuario, password) in users:
            hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt(rounds=10))
            cursor.execute(
                "UPDATE \"Usuarios\" SET password = %s WHERE id_usuario = %s",
                (hashed_password.decode('utf-8'), id_usuario)
            )
            print(f"🔒 Usuario {id_usuario} actualizado")
        
        conn.commit()
        print("🎉 ¡Migración completada con éxito!")
        
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    migrate_passwords()