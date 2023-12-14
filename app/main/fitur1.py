# app/main/fitur1.py
from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
import pickle
import numpy as np

app = Flask(__name__)

# Load model file .h5
model = load_model('C:\Users\kasmi\Documents\GitHub\ChillGoApp\save-model\fitur1.h5')

# Load model file .pickle
with open('C:\\Users\\kasmi\\Documents\\GitHub\\ChillGoApp\\save-model\\fitur1.pickle', 'rb') as f:
    model_from_pickle = pickle.load(f)

# Definisikan untuk proses data input
def preprocess_input(data):
    # Menambahkan process logic
    # Contoh
    return data

@app.route('/predict/fitur1', methods=['POST'])
def predict_fitur1():
    try:
        # Mengambil data dari from request
        data = request.json
        # Proses Input Data
        processed_data = preprocess_input(data)
        # Melakukan prediksi menggunakan model yang telah di load (.h5)
        prediction = model.predict(np.array([processed_data]))
        # Masukan logika setelah proses prediksi model disini (kalo ada)
        result = {"prediction": prediction[0].item()}
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)})

@app.route('/predict/fitur1/pickle', methods=['POST'])
def predict_fitur1_pickle():
    try:
        # Mengambil data dari from request
        data = request.json
        # Proses Input Data
        processed_data = preprocess_input(data)
        # Melakukan prediksi menggunakan model yang telah di load (.h5)
        prediction = model_from_pickle.predict(np.array([processed_data]))
        # Masukan logika setelah proses prediksi model disini (kalo ada)
        result = {"prediction": prediction[0].item()}
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == '__main__':
    app.run(debug=True)
