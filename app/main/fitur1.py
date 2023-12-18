from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import h5py  # Import h5py library to check model file content

app = Flask(__name__)

# Memuat model Keras yang sudah dilatih
# model = load_model(r'C:\Users\kasmi\Documents\GitHub\ChillGoApp\model-ml\fitur1.h5')

max_rating = max(ratings['rating'])

# Membuat model RecommenderNet
class RecommenderNet(tf.keras.Model):
    def __init__(self, users_count, place_count, embedding_size, **kwargs):
        super(RecommenderNet, self).__init__(**kwargs)
        self.users_count = users_count
        self.place_count = place_count
        self.embedding_size = embedding_size
        self.user_embedding = layers.Embedding(users_count, embedding_size,
                                              embeddings_initializer='he_normal',
                                              embeddings_regularizer=keras.regularizers.l2(1e-8))
        self.user_bias = layers.Embedding(users_count, 1)
        self.place_embedding = layers.Embedding(place_count, embedding_size,
                                               embeddings_initializer='he_normal',
                                               embeddings_regularizer=keras.regularizers.l2(1e-8))
        self.place_bias = layers.Embedding(place_count, 1)

    def call(self, inputs):
        user_vector = self.user_embedding(inputs[:, 0])
        user_bias = self.user_bias(inputs[:, 0])
        place_vector = self.place_embedding(inputs[:, 1])
        place_bias = self.place_bias(inputs[:, 1])

        dot_user_place = tf.tensordot(user_vector, place_vector, 2)
        x = dot_user_place + user_bias + place_bias

        return tf.nn.sigmoid(x)

# Membuat instance dari model RecommenderNet
embedding_size = 50
model = RecommenderNet(users_count, place_count, embedding_size)
model.compile(loss=tf.keras.losses.BinaryCrossentropy(),
              optimizer=keras.optimizers.Adam(learning_rate=0.0001),
              metrics=[tf.keras.metrics.RootMeanSquaredError()])

# Mendefinisikan route untuk prediksi
@app.route('/predict', methods=['POST'])
def predict():
    # Mendapatkan data input dari permintaan
    data = request.get_json(force=True)

    # Memproses data input (sesuaikan dengan kebutuhan model)
    user_id = data['user_id']  # Asumsi Anda menyertakan user_id dalam permintaan
    place_ids = data['place_ids']  # Asumsi Anda menyertakan place_ids dalam permintaan

    # Mengonversi user_id dan place_ids ke format input model
    user_encoder = user_to_user_encoded.get(user_id)
    place_ids_encoded = [place_to_place_encoded.get(place_id) for place_id in place_ids]
    user_place_array = np.array([[user_encoder, place_id] for place_id in place_ids_encoded])

    # Melakukan prediksi menggunakan model yang sudah dilatih
    ratings = model.predict(user_place_array).flatten()

    # Menyusun kembali hasil prediksi jika diperlukan

    # Mengonversi hasil prediksi ke format JSON dan mengembalikan respons
    response = jsonify({'predictions': ratings.tolist()})

    return response

if __name__ == "__main__":
    app.run(debug=True)
