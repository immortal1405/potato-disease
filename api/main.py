from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import numpy as np
from io import BytesIO
from PIL import Image
import os

os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

import tensorflow as tf

app = Flask(__name__)

print("Loading model")
MODEL = tf.keras.models.load_model("/home/justnik/potato-disease/saved_models/1.keras")
print("Model loaded ", MODEL)

CLASS_NAMES = ["Early Blight", "Late Blight", "Healthy"]

@app.route("/ping", methods=["GET"])
def ping():
    return "Hello, I am alive"

def read_file_as_image(file) -> np.ndarray:
    image = Image.open(file).convert('RGB').resize((256, 256))
    image = np.array(image)
    img = image/255
    return img

@app.route("/predict", methods=["POST"])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'})
    
    if file:
        try:
            image = read_file_as_image(file)
            img_batch = tf.expand_dims(image, 0)
            
            predictions = MODEL.predict(img_batch)
            
            predicted_class = CLASS_NAMES[np.argmax(predictions[0])]
            confidence = float(np.max(predictions[0]))
            
            return jsonify({
                'class': predicted_class,
                'confidence': confidence
            })
        except Exception as e:
            return jsonify({'error': str(e)})

if __name__ == "__main__":
    app.run(host='localhost', port=8000)
