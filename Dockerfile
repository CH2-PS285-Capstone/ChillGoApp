# Gunakan image Node.js versi 14 sebagai base image
FROM node:14

# Set working directory di dalam container
WORKDIR /usr/src/app

# Menyalin package.json dan package-lock.json ke dalam direktori kerja di dalam container
COPY ChillGoApp/src/package*.json ./

# Install dependensi yang diperlukan
RUN npm install

# Menyalin seluruh konten ke dalam direktori kerja di dalam container
COPY . .

# Port yang digunakan oleh API
EXPOSE 3000

# Atur perintah yang akan dijalankan saat container dimulai
CMD ["node", "index.js"]
