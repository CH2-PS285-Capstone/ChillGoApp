const Place = require('../models/Place');

const getAllPlaces = async(req, res, next) => {
    try {
        const placeList = await Place.findAll();
        console.log('Tourist Attraction List:', placeList);
        res.status(200).json({ error: false, message: 'Success', data: placeList });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: true, message: 'Internal Server Error' });
    }
};

const getPlaceById = async(req, res, next) => {
    const { id } = req.params;
    try {
        const place = await Place.findByPk(id);
        if (!place) {
            return res.status(404).json({ error: true, message: 'Tourist attractions not found' });
        }
        console.log('Tourist Attraction Details:', place);
        res.status(200).json({ error: false, message: 'Success', data: place });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: true, message: 'Internal Server Error' });
    }
};

const addPlace = async(req, res, next) => {
    const {
        Place_Name,
        Place_Image,
        City,
        Place_Address,
        Lat,
        Long,
        Description,
        Ticket_Price,
        Place_Ratings,
        Schedule_Operational,
        Review,
        User_Id,
    } = req.body;
    try {
        const newPlace = await Place.create({
            Place_Name,
            Place_Image,
            City,
            Place_Address,
            Lat,
            Long,
            Description,
            Ticket_Price,
            Place_Ratings,
            Schedule_Operational,
            Review,
            User_Id,
        });
        console.log('New Tourist Attractions:', newPlace);
        res.status(201).json({ error: false, message: 'Success', data: newPlace });
    } catch (error) {
        console.error('Error:', next(error));
        res.status(500).json({ error: true, message: 'Internal Server Error' });
    }
};

const updatePlace = async(req, res, next) => {
    const { id } = req.params;
    const {
        Place_Name,
        Place_Image,
        City,
        Place_Address,
        Lat,
        Long,
        Description,
        Ticket_Price,
        Place_Ratings,
        Schedule_Operational,
        Review,
        User_Id,
    } = req.body;
    try {
        const place = await Place.findByPk(id);
        if (!place) {
            return res.status(404).json({ error: true, message: 'Tourist attractions not found' });
        }
        await place.update({
            Place_Name,
            Place_Image,
            City,
            Place_Address,
            Lat,
            Long,
            Description,
            Ticket_Price,
            Place_Ratings,
            Schedule_Operational,
            Review,
            User_Id,
        });
        console.log('Tourist Attractions Updated:', place);
        res.status(200).json({ error: false, message: 'Success', data: place });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: true, message: 'Internal Server Error' });
    }
};

const deletePlace = async(req, res) => {
    const { id } = req.params;
    try {
        const place = await Place.findByPk(id);
        if (!place) {
            return res.status(404).json({ error: true, message: 'Tourist attractions not found' });
        }
        await place.destroy();
        console.log('Tourist Attractions Removed:', place);
        res.status(204).json({ error: false, message: 'Success' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: true, message: 'Internal Server Error' });
    }
};

module.exports = {
    getAllPlaces,
    getPlaceById,
    addPlace,
    updatePlace,
    deletePlace,
};