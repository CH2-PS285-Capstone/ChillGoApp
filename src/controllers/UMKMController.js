const UMKM = require('../models/UMKM');

// Mendapatkan semua UMKM
const getAllUMKM = async(req, res) => {
    try {
        const umkmList = await UMKM.findAll();
        console.log('UMKM List:', umkmList);
        res.status(200).json({ error: false, message: 'Success', data: umkmList });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: true, message: 'Internal Server Error' });
    }
};

// Mendapatkan detail UMKM berdasarkan ID
const getUMKMById = async(req, res) => {
    const { id } = req.params;
    try {
        const umkm = await UMKM.findByPk(id);
        if (!umkm) {
            return res.status(404).json({ error: true, message: 'UMKM not found' });
        }
        console.log('Detail UMKM:', umkm);
        res.status(200).json({ error: false, message: 'Success', data: umkm });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: true, message: 'Internal Server Error' });
    }
};

// Menambah UMKM baru
const addUMKM = async(req, res) => {
    const { 
        UMKM_Name, 
        UMKM_Image, 
        UMKM_Address, 
        UMKM_Ratings, 
        Product_Description, 
        Category, 
        Phone_Number, 
        Product_Price, 
        Schedule_Operational, 
        User_Id, 
    } = req.body;
    try {
        const newUMKM = await UMKM.create({
            UMKM_Name,
            UMKM_Image,
            UMKM_Address,
            UMKM_Ratings,
            Product_Description,
            Category,
            Phone_Number,
            Product_Price,
            Schedule_Operational,
            User_Id,
        });
        console.log('UMKM Baru:', newUMKM);
        res.status(201).json({ error: false, message: 'Success', data: newUMKM });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: true, message: 'Internal Server Error' });
    }
};

// Memperbarui informasi UMKM berdasarkan ID
const updateUMKM = async(req, res) => {
    const { id } = req.params;
    const { 
        UMKM_Name, 
        UMKM_Image, 
        UMKM_Address, 
        UMKM_Ratings, 
        Product_Description, 
        Category, 
        Phone_Number, 
        Product_Price, 
        Schedule_Operational, 
        User_Id,  
    } = req.body;
    try {
        const umkm = await UMKM.findByPk(id);
        if (!umkm) {
            return res.status(404).json({ error: true, message: 'UMKM not found' });
        }
        await umkm.update({
            UMKM_Name, 
            UMKM_Image, 
            UMKM_Address, 
            UMKM_Ratings, 
            Product_Description, 
            Category, 
            Phone_Number, 
            Product_Price, 
            Schedule_Operational, 
            User_Id, 
        });
        console.log('Updated UMKM:', umkm);
        res.status(200).json({ error: false, message: 'Success', data: umkm });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: true, message: 'Internal Server Error' });
    }
};

// Menghapus UMKM berdasarkan ID
const deleteUMKM = async(req, res) => {
    const { id } = req.params;
    try {
        const umkm = await UMKM.findByPk(id);
        if (!umkm) {
            return res.status(404).json({ error: true, message: 'UMKM not found' });
        }
        await umkm.destroy();
        console.log('Removed UMKM:', umkm);
        res.status(204).json({ error: false, message: 'Success' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: true, message: 'Internal Server Error' });
    }
};

module.exports = {
    getAllUMKM,
    getUMKMById,
    addUMKM,
    updateUMKM,
    deleteUMKM,
};