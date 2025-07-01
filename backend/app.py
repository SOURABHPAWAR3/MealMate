from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import bcrypt
import jwt
from datetime import datetime, timedelta
from pytz import timezone
import os
import uuid
from bson import ObjectId

from db import users_collection  # Custom module
from face_utils import encode_face, compare_faces  # Face recognition utils

# ---------------------- Flask App Setup ----------------------
app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = 'secret123'  # Change this in production!

# ---------------------- MongoDB Atlas Connection ----------------------
client = MongoClient("mongodb+srv://admin:mealmate123@cluster0.l6zksvs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client['mealmate_db']
admin_collection = db['admins']
users_collection = db['users']

# ---------------------- ROUTES ----------------------

@app.route('/')
def home():
    return "👋 MealMate API is running!"


# ---------------- Admin Login ----------------
@app.route('/admin/login', methods=['POST'])
def admin_login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    admin = admin_collection.find_one({'email': email})
    if not admin:
        return jsonify({'error': 'Admin not found'}), 404

    if bcrypt.checkpw(password.encode(), admin['password'].encode()):
        token = jwt.encode(
            {'admin_id': str(admin['_id']), 'exp': datetime.utcnow() + timedelta(hours=1)},
            app.config['SECRET_KEY'],
            algorithm='HS256'
        )
        return jsonify({'message': 'Login successful ✅', 'token': token})
    else:
        return jsonify({'error': 'Invalid password ❌'}), 401


# ---------------- Forgot Password ----------------
@app.route('/admin/forgot-password', methods=['POST'])
def forgot_password():
    data = request.json
    email = data.get('email')

    if not email:
        return jsonify({'error': 'Email is required'}), 400

    admin = admin_collection.find_one({'email': email})
    if not admin:
        return jsonify({'error': 'Admin not found'}), 404

    reset_token = str(uuid.uuid4())
    admin_collection.update_one(
        {'email': email},
        {
            '$set': {
                'reset_token': reset_token,
                'token_expiry': datetime.utcnow() + timedelta(minutes=10)
            }
        }
    )
    return jsonify({'message': 'Reset token generated ✅', 'reset_token': reset_token})


# ---------------- Reset Password ----------------
@app.route('/admin/reset-password', methods=['POST'])
def reset_password():
    data = request.json
    email = data.get('email')
    reset_token = data.get('reset_token')
    new_password = data.get('new_password')

    if not all([email, reset_token, new_password]):
        return jsonify({'error': 'All fields are required'}), 400

    admin = admin_collection.find_one({'email': email})
    if not admin:
        return jsonify({'error': 'Admin not found'}), 404

    if admin.get('reset_token') != reset_token:
        return jsonify({'error': 'Invalid reset token'}), 401

    if datetime.utcnow() > admin.get('token_expiry', datetime.utcnow()):
        return jsonify({'error': 'Reset token expired'}), 403

    hashed_pw = bcrypt.hashpw(new_password.encode(), bcrypt.gensalt()).decode()

    admin_collection.update_one(
        {'email': email},
        {
            '$set': {'password': hashed_pw},
            '$unset': {'reset_token': "", 'token_expiry': ""}
        }
    )

    return jsonify({'message': 'Password reset successfully ✅'})


# ---------------- Add Customer ----------------
@app.route('/admin/add-customer', methods=['POST'])
def add_customer():
    name = request.form.get('name')
    email = request.form.get('email')
    subscription_count = request.form.get('subscription_count')
    image = request.files.get('image')

    if not all([name, email, subscription_count, image]):
        return jsonify({'error': 'All fields are required'}), 400

    try:
        subscription_count = int(subscription_count)
    except ValueError:
        return jsonify({'error': 'Subscription count must be an integer'}), 400

    path = f"../dataset/{email}.jpg"
    image.save(path)

    encoding = encode_face(path)
    if encoding is None:
        return jsonify({'error': 'No face detected'}), 400

    users_collection.insert_one({
        'name': name,
        'email': email,
        'subscription_count': subscription_count,
        'encoding': encoding.tolist(),
        'meals': [],
        'created_at': datetime.utcnow()
    })

    return jsonify({'message': 'Customer added successfully ✅'})


# ---------------- Face Verification ----------------
@app.route('/verify', methods=['POST'])
def verify():
    image = request.files['image']
    path = "temp.jpg"
    image.save(path)

    uploaded_encoding = encode_face(path)
    if uploaded_encoding is None:
        return jsonify({'error': 'No face detected'}), 400

    users = list(users_collection.find())
    known_encodings = [user['encoding'] for user in users]
    results, _ = compare_faces(known_encodings, uploaded_encoding)

    if True in results:
        matched_index = results.index(True)
        user = users[matched_index]

        users_collection.update_one(
            {'_id': user['_id']},
            {'$push': {'meals': {
                'timestamp': datetime.utcnow(),
                'method': 'face'
            }}}
        )

        remaining = user.get('subscription_count', 0) - len(user.get('meals', [])) - 1
        return jsonify({
            'name': user['name'],
            'message': 'Meal logged ✅',
            'remaining_meals': max(remaining, 0)
        })
    else:
        return jsonify({'message': 'Face not recognized ❌'})


# ---------------- Manual Log ----------------
@app.route('/manual-log', methods=['POST'])
def manual_log():
    data = request.json
    name = data.get('name')
    reason = data.get('reason')

    if not name or not reason:
        return jsonify({'error': 'Name and reason are required'}), 400

    user = users_collection.find_one({'name': name})
    if not user:
        return jsonify({'error': 'User not found'}), 404

    users_collection.update_one(
        {'_id': user['_id']},
        {'$push': {'meals': {
            'timestamp': datetime.utcnow(),
            'method': 'manual',
            'reason': reason
        }}}
    )

    remaining = user.get('subscription_count', 0) - len(user.get('meals', [])) - 1
    return jsonify({
        'message': f'Meal logged manually for {name} ✅',
        'remaining_meals': max(remaining, 0)
    })


# ---------------- Get All Users (Names) ----------------
@app.route('/users', methods=['GET'])
def get_users():
    users = users_collection.find({}, {'name': 1})
    return jsonify([{'name': user['name']} for user in users])


# ---------------- Face Registration ----------------
@app.route('/register_user', methods=['POST'])
def register_user():
    name = request.form['name']
    image = request.files['image']
    path = f"../dataset/{name}.jpg"
    image.save(path)

    encoding = encode_face(path)
    if encoding is None:
        return jsonify({'error': 'No face detected'}), 400

    users_collection.insert_one({
        'name': name,
        'encoding': encoding.tolist(),
        'meals': []
    })

    return jsonify({'message': 'User registered successfully'})


# ---------------- Admin Today Attendance (IST Timezone Support) ----------------
@app.route('/admin/today-attendance', methods=['GET'])
def today_attendance():
    date_str = request.args.get('date')
    try:
        ist = timezone('Asia/Kolkata')

        # Use today's date in IST if not provided
        if date_str:
            selected_date = datetime.strptime(date_str, '%Y-%m-%d')
        else:
            selected_date = datetime.now(ist)

        # Localize to IST timezone
        selected_date = ist.localize(selected_date)
        #if selected_date.tzinfo is None :
         #   selected_date = ist.localize(selected_date)
        start_ist = selected_date.replace(hour=0, minute=0, second=0, microsecond=0)
        end_ist = start_ist + timedelta(days=1)

        # Convert to UTC for MongoDB query
        start_utc = start_ist.astimezone(timezone('UTC'))
        end_utc = end_ist.astimezone(timezone('UTC'))

        print(f"Querying meals from {start_utc.isoformat()} to {end_utc.isoformat()}")

        # Find users who marked attendance in that time
        customers = users_collection.find({
            "meals.timestamp": {
                "$gte": start_utc,
                "$lt": end_utc
            }
        })

        result = []
        for user in customers:
            meals_today = [
                meal for meal in user.get("meals", [])
                if meal.get("timestamp") and start_utc <= meal["timestamp"] < end_utc
            ]
            if meals_today:
                result.append({
                     
                    "name": user["name"],
                    "meals_today": meals_today,
                })

        return jsonify(sorted(result, key=lambda x: x['name'].lower() if x['name'] else ""))
    except Exception as e:
        print("Error in /admin/today-attendance:", e)
        return jsonify({'error': 'Internal server error'}), 500



# ---------------------- RUN ----------------------
if __name__ == '__main__':
    app.run(debug=True)