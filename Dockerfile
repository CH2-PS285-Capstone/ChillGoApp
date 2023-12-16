# Menggunakan base image Python 3.11.0
FROM python:3.11.0

# Set working directory di dalam container
WORKDIR /usr/src/app

# Menyalin file requirements.txt ke dalam container
COPY requirements.txt requirements.txt

# Mengatur environment variable untuk memperbaiki stdout buffering
ENV PYTHONUNBUFFERED=1

# Mengatur host yang akan digunakan oleh aplikasi (0.0.0.0 = semua alamat yang tersedia)
ENV HOST 0.0.0.0

# Mengekspos port 8080 untuk komunikasi internal aplikasi jika diperlukan
EXPOSE 8080

# Expose port yang digunakan oleh aplikasi Flask (5000 default untuk Flask)
EXPOSE 5000

# Menjalankan aplikasi dengan perintah python main.py
CMD ["python", "app.py"]
