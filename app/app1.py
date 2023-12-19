"""

pada file app.py ini merupakan integrasi dari kedua fitur.
fitur 1 adalah rekomendasi wisata berdasarkan high rating dari user
fitur 3 adalah rekomendasi wisata berdasarkan hasil onboarding user ketika memilih kategori di awal aplikasi

"""

from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
import tensorflow as tf
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.model_selection import train_test_split

app = Flask(__name__)

# Load the data for fitur1
df_fitur1 = pd.read_csv(r'C:\Users\kasmi\Documents\GitHub\ChillGoApp\dataset\user_rating_clean.csv')

# Train the item similarity model for fitur1
train_data_fitur1, _ = train_test_split(df_fitur1, test_size=0.2, random_state=42)
train_item_user_matrix_fitur1 = train_data_fitur1.pivot_table(index='Place_Id', columns='User_Id', values='Place_Ratings', fill_value=0)
item_similarity_train_fitur1 = cosine_similarity(train_item_user_matrix_fitur1)
item_similarity_model_fitur1 = pd.DataFrame(item_similarity_train_fitur1, index=train_item_user_matrix_fitur1.index, columns=train_item_user_matrix_fitur1.index)

# Load the item similarity model for fitur1
item_similarity_model_fitur1 = pd.read_pickle(r'C:\Users\kasmi\Documents\GitHub\ChillGoApp\model-ml\fitur1.pkl')

# Load the data for fitur3
df_fitur3 = pd.read_csv(r'C:\Users\kasmi\Documents\GitHub\ChillGoApp\dataset\user_rating_clean.csv')

# Train the item similarity model for fitur3
train_data_fitur3, _ = train_test_split(df_fitur3, test_size=0.2, random_state=42)
train_item_user_matrix_fitur3 = train_data_fitur3.pivot_table(index='Place_Id', columns='User_Id', values='Place_Ratings', fill_value=0)
item_similarity_train_fitur3 = cosine_similarity(train_item_user_matrix_fitur3)
item_similarity_model_fitur3 = pd.DataFrame(item_similarity_train_fitur3, index=train_item_user_matrix_fitur3.index, columns=train_item_user_matrix_fitur3.index)

# Load the item similarity model for fitur3
item_similarity_model_fitur3 = pd.read_pickle(r'C:\Users\kasmi\Documents\GitHub\ChillGoApp\model-ml\fitur3.pkl')

# Function to recommend places based on ratings for fitur1
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

# Function to recommend places based on category for fitur3
def recommend_places_fitur3(category, item_similarity_model, top_n=10):
    places_in_category = df_fitur3[df_fitur3['Category'] == category]['Place_Id'].unique()
    valid_places_in_category = set(places_in_category) & set(item_similarity_model.columns)

    if not valid_places_in_category:
        return pd.DataFrame(columns=['Place_Id', 'Place_Name', 'Category'])

    place_similarity_scores = item_similarity_model[list(valid_places_in_category)].mean(axis=1)
    top_places = place_similarity_scores.sort_values(ascending=False).index
    recommended_places = df_fitur3[df_fitur3['Place_Id'].isin(top_places) & (df_fitur3['Category'] == category)][['Place_Id', 'Place_Name', 'Category', 'City']].drop_duplicates()

    return recommended_places.head(top_n)

@app.route('/', methods=['GET'])
def home():
    return "Selamat datang di Tourism Recommendation API!"

# Route for fitur1
@app.route('/recommend-places-rating', methods=['GET'])
def get_recommendations_fitur1():
    recommended_places_info = recommend_places_fitur1()

    response = {
        'top_recommendations': recommended_places_info.to_dict(orient='index')
    }
    return jsonify(response)

# Route for fitur3
@app.route('/onboarding', methods=['POST'])
def recommend_places_fitur3_api():
    data = request.get_json()

    if 'category' not in data:
        return jsonify({'error': 'Category is required'}), 400

    category = data['category'].lower()
    df_fitur3['Category'] = df_fitur3['Category'].str.lower()

    valid_categories = df_fitur3['Category'].unique()

    if category not in valid_categories:
        return jsonify({'error': 'Invalid category'}), 400

    recommended_places = recommend_places_fitur3(category, item_similarity_model_fitur3, top_n=10)

    if recommended_places.empty:
        return jsonify({'message': 'No recommendations for the given category'}), 200
    else:
        return jsonify({'recommended_places': recommended_places.to_dict(orient='records')}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)

