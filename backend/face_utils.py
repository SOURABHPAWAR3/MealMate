import face_recognition
import numpy as np
import os

# ✅ Manually fix model path issue
# This block tells face_recognition where the model files are
model_dir = os.path.abspath(
    os.path.join(
        os.path.dirname(face_recognition.__file__),
        '..',
        'face_recognition_models',
        'models'
    )
)

face_recognition.api.pose_predictor_model_location = lambda: os.path.join(model_dir, 'shape_predictor_68_face_landmarks.dat')
face_recognition.api.face_recognition_model_location = lambda: os.path.join(model_dir, 'dlib_face_recognition_resnet_model_v1.dat')

def encode_face(image_path):
    image = face_recognition.load_image_file(image_path)
    encodings = face_recognition.face_encodings(image)
    return encodings[0] if encodings else None

def compare_faces(known_encodings, uploaded_encoding):
    results = face_recognition.compare_faces(known_encodings, uploaded_encoding)
    distances = face_recognition.face_distance(known_encodings, uploaded_encoding)
    return results, distances
