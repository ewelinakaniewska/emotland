from fastapi import FastAPI, File, UploadFile, HTTPException
import matplotlib.pyplot as plt
from PIL import Image
import tensorflow as tf
import numpy as np
import io
from mtcnn import MTCNN

app = FastAPI()

model = tf.keras.models.load_model("imageclassifier2.h5")
CLASS_NAMES = ['anger', 'disgust', 'fear', 'happiness', 'neutral', 'sadness', 'surprise']

detector = MTCNN()


def crop_face(img: Image.Image):
    try:
        img_rgb = np.array(img.convert("RGB"))
        h_orig, w_orig, _ = img_rgb.shape
        if h_orig < 40 or w_orig < 40: 
            return None
        try:
            results = detector.detect_faces(img_rgb)
        except Exception as e:
            print(f"MTCNN Error: {e}")
            return None

        if not results:
            return None

        best_face = max(results, key=lambda x: x['confidence'])
        x, y, w, h = best_face['box']
        x1, y1 = max(0, x), max(0, y)
        x2, y2 = min(w_orig, x + w), min(h_orig, y + h)
        face = img_rgb[y1:y2, x1:x2]

        if face.size == 0 or face.shape[0] < 10 or face.shape[1] < 10:
            return None
            
        return Image.fromarray(face)
        
    except Exception as e:
        print(f"Unexpected error in crop_face: {e}")
        return None

def preprocess(img: Image.Image):
    img = img.convert("L")
    img = img.resize((48, 48))
    x = np.array(img).astype("float32") / 255.0
    x = np.expand_dims(x, axis=-1)
    x = np.expand_dims(x, axis=0)
    return x


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes))

    face = crop_face(image)
    if face is None:
            raise HTTPException(
                status_code=400, 
                detail="""Nie udało się wykryć lub przetworzyć twarzy. 
                Upewnij się, że twarz jest widoczna i oświetlona."""
            )

    x = preprocess(face)


    preds = model.predict(x)
    idx = int(np.argmax(preds[0]))

    return {
        "label": CLASS_NAMES[idx],
        "score": float(preds[0][idx])
    }
