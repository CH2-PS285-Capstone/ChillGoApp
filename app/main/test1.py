# app/main/fitur1_test_local.py
from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
import pickle
import numpy as np
from tensorflow.keras import layers

app = Flask(__name__)

# Initialize model and model_from_pickle
model = None
model_from_pickle = None

# Load model file .h5
try:
    model = load_model('C:\\Users\\kasmi\\Documents\\GitHub\\ChillGoApp\\save-model\\fitur1.h5', custom_objects={"RecommenderNet": layers.Embedding})
    model.load_weights('C:\\Users\\kasmi\\Documents\\GitHub\\ChillGoApp\\save-model\\fitur1.h5')
    print("Model weights successfully loaded.")
except Exception as e:
    print(f"Error loading .h5 model: {e}")

# Load model file .pickle
try:
    with open('C:\\Users\\kasmi\\Documents\\GitHub\\ChillGoApp\\save-model\\fitur1.pickle', 'rb') as f:
        model_from_pickle = pickle.load(f)
        print("Model .pickle successfully loaded.")
except Exception as e:
    print(f"Error loading .pickle model: {e}")

# Definisikan untuk proses data input
def preprocess_input(data):
    # Menambahkan logika preprocessing jika diperlukan
    # Contoh
    processed_data = np.array([data["user"], data["place"]])  # Sesuaikan dengan model
    return processed_data

@app.route("/")
def index():
    return jsonify({
        "status": {
            "code": 200,
            "message": "Success fetching ke API"
        },
        "data": None
    }), 200

@app.route("/predict/fitur1", methods=['GET'])
def predict_fitur1():
    if model is not None:
        try:
            # Menampilkan informasi bahwa model berhasil di-load
            return jsonify({"message": "Model .h5 successfully loaded"}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    else:
        return jsonify({"error": "Model .h5 not loaded"}), 500

@app.route("/predict/fitur1/pickle", methods=['GET'])
def predict_fitur1_pickle():
    if model_from_pickle is not None:
        try:
            # Menampilkan informasi bahwa model berhasil di-load
            return jsonify({"message": "Model .pickle successfully loaded"}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    else:
        return jsonify({"error": "Model .pickle not loaded"}), 500

if __name__ == '__main__':
    app.run(debug=True)
