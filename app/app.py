"""

pada file app.py ini merupakan integrasi dari ketiga fitur.
fitur 1 adalah rekomendasi wisata berdasarkan high rating dari user
fitur 2 adalah rekomendasi wisata berdasarkan hasil searching user (berdasarkan kota/kabupaten wisata yang dicari user)
fitur 3 adalah rekomendasi wisata berdasarkan hasil onboarding user ketika memilih kategori di awal aplikasi

"""

from flask import Flask, jsonify, request
import pandas as pd
import numpy as np
import tensorflow as tf
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from sklearn.feature_extraction.text import TfidfVectorizer
import pickle

app = Flask(__name__)

# Load dataset for fitur1
df_fitur1 = pd.read_csv(r'C:\Users\kasmi\Documents\GitHub\ChillGoApp\dataset\user_rating_clean.csv')

# Load model and data for fitur1
path_model_fitur1 = r'C:\Users\kasmi\Documents\GitHub\ChillGoApp\model-ml\fitur1-2.h5'  # Ganti dengan path model Anda
model_fitur1 = tf.keras.models.load_model(path_model_fitur1)
train_user_item_matrix_fitur1 = df_fitur1.pivot_table(index='User_Id', columns='Place_Id', values='Place_Ratings', fill_value=0)
user_item_matrix_normalized_fitur1 = train_user_item_matrix_fitur1.sub(train_user_item_matrix_fitur1.mean(axis=1), axis=0)
user_similarity_fitur1 = cosine_similarity(train_user_item_matrix_fitur1.values)

# Load model and data for fitur2
destinations_fitur2 = pd.read_pickle(r'C:\Users\kasmi\Documents\GitHub\ChillGoApp\model-ml\fitur2.pkl')
tfidf_vectorizer_fitur2 = TfidfVectorizer()
tfidf_matrix_fitur2 = tfidf_vectorizer_fitur2.fit_transform(destinations_fitur2['City'])
cosine_sim_df_fitur2 = pd.DataFrame(cosine_similarity(tfidf_matrix_fitur2), index=destinations_fitur2['Place_Name'], columns=destinations_fitur2['Place_Name'])

# Train the item similarity model for fitur3
train_data_fitur3, _ = train_test_split(df_fitur1, test_size=0.2, random_state=42)
train_item_user_matrix_fitur3 = train_data_fitur3.pivot_table(index='Place_Id', columns='User_Id', values='Place_Ratings', fill_value=0)
item_similarity_train_fitur3 = cosine_similarity(train_item_user_matrix_fitur3)
item_similarity_model_fitur3 = pd.DataFrame(item_similarity_train_fitur3, index=train_item_user_matrix_fitur3.index, columns=train_item_user_matrix_fitur3.index)

# Load the item similarity model for fitur3
item_similarity_model_fitur3 = pd.read_pickle(r'C:\Users\kasmi\Documents\GitHub\ChillGoApp\model-ml\fitur3.pkl')

def place_recommendation(place_name, similarity_data=cosine_sim_df_fitur2, items=destinations_fitur2[['Place_Name', 'Category', 'City']], k=15):
    index = similarity_data.loc[:, place_name].to_numpy().argpartition(range(-1, -k, -1))
    closest = similarity_data.columns[index[-1:-(k+2):-1]]
    closest = closest.drop(place_name, errors='ignore')
    return pd.DataFrame(closest).merge(items).head(k)

def recommend_places(category, item_similarity_model, top_n=10):
    places_in_category = df_fitur1[df_fitur1['Category'] == category]['Place_Id'].unique()
    valid_places_in_category = set(places_in_category) & set(item_similarity_model.columns)

    if not valid_places_in_category:
        return pd.DataFrame(columns=['Place_Id', 'Place_Name', 'Category'])

    place_similarity_scores = item_similarity_model[list(valid_places_in_category)].mean(axis=1)
    top_places = place_similarity_scores.sort_values(ascending=False).index
    recommended_places = df_fitur1[df_fitur1['Place_Id'].isin(top_places) & (df_fitur1['Category'] == category)][['Place_Id', 'Place_Name', 'Category', 'City']].drop_duplicates()

    return recommended_places.head(top_n)

@app.route('/', methods=['GET'])
def home():
    return "Selamat datang di Tourism Recommendation API!"

@app.route('/recommend-places-rating', methods=['GET'])
def get_recommendations_fitur1():
    # Function to recommend places based on ratings
    def recommend_places_fitur1():
        average_place_ratings = df_fitur1.groupby('Place_Id')['Place_Ratings'].mean()
        count_place_ratings = df_fitur1['Place_Id'].value_counts()
        place_info = pd.DataFrame({'Average_Rating': average_place_ratings, 'Rating_Count': count_place_ratings})
        top_n = 15
        top_recommendations = place_info.sort_values(by=['Average_Rating', 'Rating_Count'], ascending=[False, False]).head(top_n)
        recommended_places_info = df_fitur1[df_fitur1['Place_Id'].isin(top_recommendations.index)][['Place_Id', 'Place_Name', 'Category', 'City']].drop_duplicates()
        recommended_places_info = recommended_places_info.set_index('Place_Id')
        recommended_places_info = recommended_places_info.loc[top_recommendations.index]
        return recommended_places_info

    recommended_places_info = recommend_places_fitur1()

    response = {
        'top_recommendations': recommended_places_info.to_dict(orient='index')
    }
    return jsonify(response)

# Fitur2 routes
@app.route('/search', methods=['POST'])
def recommend_fitur2():
    try:
        data = request.get_json()
        place_name_input = data['place_name']
        normalized_place_name = ' '.join(place_name_input.lower().split())

        matching_places = destinations_fitur2[destinations_fitur2['Place_Name'].str.lower().str.contains(normalized_place_name)]

        if not matching_places.empty:
            result = {
                "selected_place": matching_places[['Place_Name', 'Category', 'City']].to_dict(orient='records'),
                "recommended_places": place_recommendation(matching_places['Place_Name'].iloc[0]).to_dict(orient='records')
            }
            return jsonify(result)
        else:
            return jsonify({"message": f"Tidak ada tempat yang cocok dengan '{place_name_input}' dalam dataset."})
    except Exception as e:
        return jsonify({"error": str(e)})

# Fitur3 routes
@app.route('/onboarding', methods=['POST'])
def recommend_places_fitur3():
    data = request.get_json()

    if 'category' not in data:
        return jsonify({'error': 'Category is required'}), 400

    category = data['category'].lower()
    df_fitur1['Category'] = df_fitur1['Category'].str.lower()

    valid_categories = df_fitur1['Category'].unique()

    if category not in valid_categories:
        return jsonify({'error': 'Invalid category'}), 400

    recommended_places = recommend_places(category, item_similarity_model_fitur3, top_n=10)

    if recommended_places.empty:
        return jsonify({'message': 'No recommendations for the given category'}), 200
    else:
        return jsonify({'recommended_places': recommended_places.to_dict(orient='records')}), 200

if __name__ == "__main__":
    app.run(debug=True, port=5000)
