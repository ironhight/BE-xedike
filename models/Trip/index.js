const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema({
    driverID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    locationFrom: String,
    locationTo: String,
    startTime: Number,
    availableSeats: Number,
    fee: Number,
    passengers: [
        {
            passengerID: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            locationFrom: String,
            locationTo: String,
            numberOfBookingSeats: Number,
            note: String
        }
    ],
    isFinished: { type: Boolean, default: false }
});

const Trip = mongoose.model('Trip', TripSchema, 'Trip');

module.exports = {
    TripSchema,
    Trip
};
