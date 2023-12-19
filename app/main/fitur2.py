"""

file ini adalah rekomendasi wisata berdasarkan hasil searching user
(berdasarkan kota/kabupaten wisata yang dicari user)

"""

from flask import Flask, jsonify, request
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer

app = Flask(__name__)

# Memuat model dan data
destinations = pd.read_pickle(r'C:\Users\kasmi\Documents\GitHub\ChillGoApp\model-ml\fitur2.pkl')

# Membuat atau memuat tfidf_matrix
tfidf_vectorizer = TfidfVectorizer()
tfidf_matrix = tfidf_vectorizer.fit_transform(destinations['City'])

cosine_sim_df = pd.DataFrame(
    cosine_similarity(tfidf_matrix), index=destinations['Place_Name'], columns=destinations['Place_Name'])

def place_recommendation(place_name, similarity_data=cosine_sim_df, items=destinations[['Place_Name', 'Category', 'City']], k=15):
    index = similarity_data.loc[:, place_name].to_numpy().argpartition(range(-1, -k, -1))
    closest = similarity_data.columns[index[-1:-(k+2):-1]]
    closest = closest.drop(place_name, errors='ignore')
    return pd.DataFrame(closest).merge(items).head(k)

@app.route('/')
def home():
    return "Selamat datang di Tourism Recommendation API!"

@app.route('/search', methods=['POST'])
def recommend():
    try:
        data = request.get_json()
        place_name_input = data['place_name']
        normalized_place_name = ' '.join(place_name_input.lower().split())

        matching_places = destinations[destinations['Place_Name'].str.lower().str.contains(normalized_place_name)]

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

if __name__ == "__main__":
    app.run(debug=True)
