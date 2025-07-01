# create_admin.py

import bcrypt
from pymongo import MongoClient

# Replace with your MongoDB Atlas connection string
MONGO_URI = "mongodb+srv://admin:mealmate123@cluster0.l6zksvs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(MONGO_URI)

# Choose database and collection
db = client['mealmate']
admin_collection = db['admins']

# Admin credentials
admin_email = "sourabhpawar242002@gmail.com"
plain_password = "sourabh123"

# Hash the password
hashed_password = bcrypt.hashpw(plain_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

# Insert the admin into database
admin_data = {
    "email": admin_email,
    "password": hashed_password
}

# Check if admin already exists
if admin_collection.find_one({"email": admin_email}):
    print("Admin already exists.")
else:
    admin_collection.insert_one(admin_data)
    print("✅ Admin inserted successfully!")
