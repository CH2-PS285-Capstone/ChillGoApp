# Gunakan base image yang sudah termasuk Python dan pip
FROM python:3.9.2-slim

# Atur working directory di dalam kontainer
WORKDIR /app

# Salin file-file proyek ke dalam kontainer
COPY . /app

# Install dependensi dari requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Expose port yang digunakan oleh aplikasi
EXPOSE 5000

# Perintah untuk menjalankan aplikasi Flask menggunakan Gunicorn
CMD ["gunicorn", "-w", "4", "app:app", "--bind", "0.0.0.0:5000"]
