import face_recognition
import os

# Locate model path manually
model_path = os.path.abspath(
    os.path.join(
        os.path.dirname(face_recognition.__file__),
        '..',
        'face_recognition_models',
        'models'
    )
)

print("Model path being used:", model_path)

print("Checking if model files exist...")
model1 = os.path.join(model_path, 'dlib_face_recognition_resnet_model_v1.dat')
model2 = os.path.join(model_path, 'shape_predictor_68_face_landmarks.dat')

print("resnet model:", os.path.exists(model1))
print("landmark model:", os.path.exists(model2))
