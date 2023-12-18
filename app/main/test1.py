"""

File ini tidak terpakai, khusus untuk testing deploy flask

"""


from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
import tensorflow as tf
import logging

app = Flask(__name__)  # Memperbaiki typo di sini
logging.basicConfig(level=logging.DEBUG)

# Fungsi untuk memuat data
def load_data():
    places = pd.read_csv(r'C:\Users\kasmi\Documents\GitHub\ChillGoApp\dataset\Data_Destination_Tourism_West_java.csv', encoding='ISO-8859-1')
    ratings = pd.read_csv(r'C:\Users\kasmi\Documents\GitHub\ChillGoApp\dataset\merged_ratings.csv', encoding='ISO-8859-1')
    return places, ratings

# Memuat model yang telah dilatih sebelumnya
model = tf.keras.models.load_model(r'C:\Users\kasmi\Documents\GitHub\ChillGoApp\model-ml\fitur12')

places, ratings = load_data()

# Fungsi untuk mempersiapkan data sebelum prediksi
def prepare_data_for_prediction(data):
    # Example: Select and process relevant columns
    # Adjust the column names and processing according to your model's requirements
    processed_data = data[['Place_Id']].copy()  # Replace with actual column names
    processed_data = processed_data.astype(np.float32)    # Convert data types if necessary
    return processed_data


# Endpoint Flask untuk rekomendasi
@app.route('/recommend', methods=['GET'])
def recommend():
    try:
        user_id = request.args.get('user_id', type=int)
        logging.debug(f"User ID: {user_id}")

        rated_places = ratings[ratings['User_Id'] == user_id]['Place_Id']
        places_to_predict = places[~places['Place_Id'].isin(rated_places)]
        logging.debug(f"Places to predict: {places_to_predict}")

        places_to_predict_prepared = prepare_data_for_prediction(places_to_predict)
        predictions = model.predict(places_to_predict_prepared)
        places_to_predict['Predicted_Rating'] = predictions.flatten()
        top_recommendations = places_to_predict.sort_values(by='Predicted_Rating', ascending=False).head(5)
        recommendations = top_recommendations['Place_Id'].tolist()

        return jsonify({'user_id': user_id, 'recommended_places': recommendations})
    except Exception as e:
        logging.error(f"Error in /recommend: {e}", exc_info=True)
        return jsonify({'error': str(e)}), 500

# Menjalankan aplikasi Flask
if __name__ == '__main__':
    app.run(debug=True, port=5000)