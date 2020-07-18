const { Car } = require('../../../models/Car');

module.exports.createCar = async (req, res, next) => {
    const driverID = req.user.id;

    const {
        carModel,
        carSeats,
        carName,
        autoMakers,
        carCertificate
    } = req.body;

    const newCar = new Car({
        carModel,
        carSeats,
        carName,
        autoMakers,
        carCertificate,
        driverID
    });

    newCar
        .save()
        .then(user => {
            res.status(200).json(user);
        })
        .catch(err => res.json(err));
};
