from google.colab import drive
drive.mount('/content/drive')

import pandas as pd
import numpy as np
from pathlib import Path
import seaborn as sns
import matplotlib.pyplot as plt
from sklearn.preprocessing import StandardScaler, MinMaxScaler

import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers

# Membaca Data dari Dataset
destinations = pd.read_csv('/content/drive/MyDrive/data/Data_Destination_Tourism_West_java.csv', encoding = 'ISO-8859-1')
# Jumlah data

# Konversi kolom 'Latitude' ke float64
destinations['Latitude'] = pd.to_numeric(destinations['Latitude'], errors='coerce')

# Konversi kolom 'Rating ke float64
destinations['Rating'] = pd.to_numeric(destinations['Rating'], errors = 'coerce')

# Periksa kembali informasi dataset
print(destinations.info())
destinations.head()

destinations = destinations.drop(['Description', 'Price', 'Rating', 'No.Telepon', 'Coordinate', 'Latitude', 'Longitude'], axis = 1)
# Pengecekan missing value destinasi wisata
destinations.isnull().sum()


# Pengecekan data duplikan

print(f'Jumlah data destinasi wisata yang duplikat: {destinations.duplicated().sum()}')

# Menghapus data duplikat berdasarkan kolom 'Place_Name'
destinations.drop_duplicates(subset='Place_Name', inplace=True)

from sklearn.feature_extraction.text import TfidfVectorizer
# Mengganti '_' dengan spasi dan menghapus spasi ekstra pada kolom 'City'
destinations['City'] = destinations['City'].apply(lambda x: x.replace('_', ' ') if '_' in x else x)
destinations['City'] = destinations['City'].apply(lambda x: ' '.join(x.split()))

# Membuat objek TfidfVectorizer
tf = TfidfVectorizer()
tfidf_matrix = tf.fit_transform(destinations['City'])

# Melatih vektorizer dengan data 'City'
tf.fit(destinations['City'])

# Mendapatkan daftar fitur (kata) yang diekstrak dari 'City'
feature_names = tf.get_feature_names_out()

tfidf_matrix = tf.fit_transform(destinations['City'])
tfidf_matrix.shape

tfidf_matrix.todense()

pd.DataFrame(
    tfidf_matrix.todense(),
    columns = tf.get_feature_names_out(),
    index = destinations.Place_Name
).sample(15, axis = 0)

from sklearn.metrics.pairwise import cosine_similarity

cosine_simlrty = cosine_similarity(tfidf_matrix)
cosine_simlrty

cosine_sim_df = pd.DataFrame(
    cosine_simlrty, index=destinations['Place_Name'], columns=destinations['Place_Name'])

print('Shape: ', cosine_sim_df.shape)
cosine_sim_df.sample(20, axis = 0)

def place_recommendation(place_name, similarity_data=cosine_sim_df, items=destinations[['Place_Name', 'Category', 'City']], k=15):
    index = similarity_data.loc[:, place_name].to_numpy().argpartition(range(-1, -k, -1))
    closest = similarity_data.columns[index[-1:-(k+2):-1]]
    closest = closest.drop(place_name, errors='ignore')
    return pd.DataFrame(closest).merge(items).head(k)

# Pengujian dan rekomendasi
place_name_input = input("Masukkan nama tempat yang ingin Anda cari rekomendasi: ")
normalized_place_name = ' '.join(place_name_input.lower().split())

matching_places = destinations[destinations['Place_Name'].str.lower().str.contains(normalized_place_name)]

if not matching_places.empty:
    print("Informasi tentang tempat yang dipilih:")
    print(matching_places[['Place_Name', 'Category', 'City']])

    print("\nTempat wisata lainnya yang direkomendasikan:")
    rekomendasi = place_recommendation(matching_places['Place_Name'].iloc[0])
    print(rekomendasi[['Place_Name', 'Category', 'City']])
else:
    print(f"Tidak ada tempat yang cocok dengan '{place_name_input}' dalam aplikasi.")


# Menyimpan DataFrame ke dalam file .pickle
destinations.to_pickle('/content/drive/MyDrive/data/fitur2.pkl')
