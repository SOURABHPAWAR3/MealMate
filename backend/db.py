from pymongo import MongoClient

MONGO_URI = "mongodb+srv://admin:mealmate123@cluster0.l6zksvs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

client = MongoClient(MONGO_URI)
db = client['mealmate_db']

users_collection = db['users']
meals_collection = db['meals']
