# Menggunakan image Node.js versi 14 sebagai base image
FROM node:14

LABEL author="Phina Putri Amalia"
LABEL api="API CC ChillGo App"

# Set working directory di dalam container
WORKDIR /workspace

# Menyalin package.json dan package-lock.json ke dalam direktori kerja di dalam container
COPY package*.json ./

# Instal Express.js pada versi 4.18.2
RUN npm install express@4.18.2

# Menyalin file utama aplikasi ke dalam direktori kerja di dalam container
COPY index.js ./

# Instal semua dependensi (jika ada dependensi tambahan)
RUN npm install

# Port yang digunakan oleh API (misalnya, port 3000)
EXPOSE 3000

# Atur perintah yang akan dijalankan saat container dimulai menggunakan nodemon
CMD ["npx", "nodemon", "index.js"]
