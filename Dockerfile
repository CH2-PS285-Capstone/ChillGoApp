# Menggunakan base image Python 3.11.0
FROM python:3.11.0

# Set working directory di dalam container
WORKDIR /usr/src/app

# Copy semua file ke dalam working directory di dalam container
COPY . .

# Install dependencies
RUN pip install --upgrade pip \
    && pip install tensorflow==2.14.0 \
    && pip install keras gunicorn

# Expose port yang digunakan oleh aplikasi Flask
EXPOSE 5000

# Menjalankan aplikasi dengan Gunicorn
CMD ["gunicorn", "-b", "0.0.0.0:5000", "app:app"]
