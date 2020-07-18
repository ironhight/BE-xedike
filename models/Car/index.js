const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
    carModel: Number,
    carSeats: Number,
    carName: String,
    autoMakers: String,
    carCertificate: String,
    driverID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Car = mongoose.model('Car', CarSchema, 'Car');

module.exports = {
    CarSchema,
    Car
};
