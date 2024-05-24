from google.cloud import storage
import tensorflow as tf
from PIL import Image
import numpy as np

BUCKET_NAME = "justnik-tf-bucket"
CLASS_NAMES = ["Early Blight", "Late Blight", "Healthy"]

model = None

def download_blob(bucket_name, source_blob_name, destination_file_name):
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(source_blob_name)

    blob.download_to_filename(destination_file_name)

def predict(request):
    global model
    if model is None:
        print("Downloading model")
        download_blob(
            BUCKET_NAME,
            "models/1.keras",
            "/tmp/1.keras"
        )
        model = tf.keras.models.load_model("/tmp/1.keras")
        print("Model downloaded ", model)

    image = request.files['file']

    image = np.array(
        Image.open(image).convert("RGB").resize((256, 256)) # image resizing
    )

    img_array = np.expand_dims(image, 0)

    predictions = model.predict(img_array)
    print(predictions)

    predicted_class = CLASS_NAMES[np.argmax(predictions[0])]
    confidence = round(100 * (np.max(predictions[0])), 2)

    return {"class": predicted_class, "confidence": confidence}