import bcrypt

# Step 1: Set your password here
plain_password = "Sourabh@123"  # You can change this password

# Step 2: Hash it
hashed_password = bcrypt.hashpw(plain_password.encode(), bcrypt.gensalt())

# Step 3: Print the hash (copy this output for MongoDB)
print("Hashed password:\n", hashed_password.decode())
