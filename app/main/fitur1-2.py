"""

File ini merupakan deploy flask dari fitur 1 berdasarkan high rating yang di ambil dari
rata rata rating tertinggi dan terbanyak dari wisata

"""

from flask import Flask, jsonify
import pandas as pd
import tensorflow as tf
from sklearn.metrics.pairwise import cosine_similarity

# Fungsi untuk memprediksi peringkat menggunakan cosine similarity
def predict_ratings(user_item_matrix, similarity_matrix):
    # Hitung hasil perkalian dot dari similarity matrix dan user-item matrix
    pred = similarity_matrix.dot(user_item_matrix)
    pred /= np.array([abs(similarity_matrix).sum(axis=1)]).T
    return pred

# Inisialisasi Flask App
app = Flask(__name__)

# Load dataset
df = pd.read_csv(r'C:\Users\kasmi\Documents\GitHub\ChillGoApp\dataset\user_rating_clean.csv')

# Buat matriks peringkat user-item
user_item_matrix = df.pivot_table(index='User_Id', columns='Place_Id', values='Place_Ratings', fill_value=0)

# Normalisasi peringkat untuk collaborative filtering
user_item_matrix_normalized = user_item_matrix.sub(user_item_matrix.mean(axis=1), axis=0)

# Load model dan data ke dalam memori
path_model = r'C:\Users\kasmi\Documents\GitHub\ChillGoApp\model-ml\fitur1-2.h5'  # Ganti dengan path model Anda
model = tf.keras.models.load_model(path_model)
train_user_item_matrix = user_item_matrix_normalized  # Gunakan seluruh data untuk prediksi
user_similarity = cosine_similarity(train_user_item_matrix.values)

# Function to recommend places based on ratings
def recommend_places():
    # Hitung rata-rata rating untuk setiap tempat wisata
    average_place_ratings = df.groupby('Place_Id')['Place_Ratings'].mean()

    # Hitung jumlah rating untuk setiap tempat wisata
    count_place_ratings = df['Place_Id'].value_counts()

    # Gabungkan informasi rata-rata rating dan jumlah rating ke dalam satu DataFrame
    place_info = pd.DataFrame({'Average_Rating': average_place_ratings, 'Rating_Count': count_place_ratings})

    # Pilih jumlah rekomendasi yang diinginkan
    top_n = 15

    # Pilih tempat wisata dengan rating tertinggi dan jumlah rating terbanyak
    top_recommendations = place_info.sort_values(by=['Average_Rating', 'Rating_Count'], ascending=[False, False]).head(top_n)

    # Tampilkan informasi tempat wisata yang direkomendasikan
    recommended_places_info = df[df['Place_Id'].isin(top_recommendations.index)][['Place_Id', 'Place_Name', 'Category', 'City']].drop_duplicates()
    recommended_places_info = recommended_places_info.set_index('Place_Id')
    recommended_places_info = recommended_places_info.loc[top_recommendations.index]

    return recommended_places_info

@app.route('/recommend-places-rating', methods=['GET'])
def get_recommendations():
    recommended_places_info = recommend_places()

    # Format respons untuk dikirim sebagai JSON
    response = {
        'top_recommendations': recommended_places_info.to_dict(orient='index')
    }
    return jsonify(response)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
