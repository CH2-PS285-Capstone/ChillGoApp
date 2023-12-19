"""

File ini merupakan deploy flask dari fitur 1 berdasarkan high rating yang di ambil dari user_id

"""

from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
import tensorflow as tf
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error
from math import sqrt
import joblib

# Function to predict ratings using cosine similarity
def predict_ratings(user_item_matrix, similarity_matrix):
    # Calculate the dot product of the similarity matrix and the user-item matrix
    pred = similarity_matrix.dot(user_item_matrix)
    pred /= np.array([np.abs(similarity_matrix).sum(axis=1)]).T
    return pred

# Flask App
app = Flask(__name__)

# Load your dataset
df = pd.read_csv(r'C:\Users\kasmi\Documents\GitHub\ChillGoApp\dataset\user_rating_clean.csv')

# Create a matrix of user-item ratings
user_item_matrix = df.pivot_table(index='User_Id', columns='Place_Id', values='Place_Ratings', fill_value=0)

# Normalize the ratings for collaborative filtering
user_item_matrix_normalized = user_item_matrix.sub(user_item_matrix.mean(axis=1), axis=0)

# Split the dataset into training and testing sets
train_data, test_data = train_test_split(df, test_size=0.2)

# Create user-item matrices for training and testing sets
train_user_item_matrix = train_data.pivot_table(index='User_Id', columns='Place_Id', values='Place_Ratings', fill_value=0)

# Load your model and data into memory
model = tf.keras.models.load_model(r'C:\Users\kasmi\Documents\GitHub\ChillGoApp\model-ml\fitur1-1.h5')  # Ganti dengan path sesuai kebutuhan
user_similarity = cosine_similarity(train_user_item_matrix.values)

# Function to predict ratings using cosine similarity
def predict_ratings(user_item_matrix, similarity_matrix):
    # Calculate the dot product of the similarity matrix and the user-item matrix
    pred = similarity_matrix.dot(user_item_matrix)
    pred /= np.array([np.abs(similarity_matrix).sum(axis=1)]).T
    return pred

@app.route('/rekomendasi-rating', methods=['POST'])
def predict():
    data = request.json  # Diasumsikan input pengguna dikirim sebagai JSON

    print("Received data:", data)  # Tambahkan baris ini
    user_id = data.get('user_id')

     # Pengecekan apakah user_id ada dalam dataset
    if user_id not in user_item_matrix.index:
        response = {"error": f"User ID {user_id} not found in the dataset"}
        return jsonify(response), 404  # Memberikan respons HTTP 404 Not Found

    # Lakukan prediksi rating untuk destinasi wisata
    user_item_prediction = predict_ratings(user_item_matrix_normalized.values, user_similarity)

    # Dapatkan rating pengguna
    user_ratings = pd.DataFrame(user_item_prediction, index=user_item_matrix_normalized.index, columns=user_item_matrix_normalized.columns)

    # Dapatkan 10 rekomendasi teratas untuk pengguna
    top_n = 10
    top_recommendations = user_ratings.loc[data['user_id']].sort_values(ascending=False).head(top_n)

    # Dapatkan informasi tempat untuk rekomendasi
    recommended_places_info = df[df['Place_Id'].isin(top_recommendations.index)][['Place_Id', 'Place_Name', 'Category', 'City']].drop_duplicates()
    recommended_places_info = recommended_places_info.set_index('Place_Id')
    recommended_places_info = recommended_places_info.loc[top_recommendations.index]

    return jsonify(recommended_places_info.to_dict(orient='records'))

if __name__ == "__main__":
    app.run(debug=True, port=5000)
