const { User } = require('../../../models/User');
const { Car } = require('../../../models/Car');
const { Trip } = require('../../../models/Trip');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validatePostInput = require('../../../validations/User/ValidatePostInput');
const ValidatePutPersonalInput = require('../../../validations/User/ValidatePutPersonalInput');
const ValidatePutPasswordInput = require('../../../validations/User/ValidatePutPasswordInput');
const moment = require('moment');
const _ = require('lodash');

// * Get user list
module.exports.getUsers = (req, res, next) => {
    User.find()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(err => res.json(err));
};

// * Add new user
module.exports.createUser = async (req, res, next) => {
    const { email, password, DOB, userType, phoneNumber, fullName } = req.body;
    const { errors, isValid } = await validatePostInput(req.body);

    if (!isValid) return res.status(400).json(errors);

    const newUser = new User({
        email,
        password,
        DOB,
        userType,
        phoneNumber,
        fullName
    });

    bcryptjs.genSalt(10, (err, salt) => {
        if (err) return res.json(err);
        bcryptjs.hash(password, salt, (err, hash) => {
            if (err) return res.json(err);
            newUser.password = hash;

            newUser
                .save()
                .then(user => {
                    res.status(200).json({
                        user,
                        statusText: 'Register successfully!'
                    });
                })
                .catch(err => res.json(err));
        });
    });
};

// * Get user detail
module.exports.getDetailUser = (req, res, next) => {
    const { id } = req.params;

    Promise.all([
        User.findById(id).select('-password -__v'),
        Car.find({ driverID: id })
    ])
        .then(results => {
            const [user, cars] = results;

            res.status(201).json({ user: user, cars: cars });
        })
        .catch(err => {
            res.status(err.status).json(err);
        });
};

// * Update user password
module.exports.updatePasswordUser = async (req, res) => {
    const { id } = req.params;
    const { errors, isValid } = await ValidatePutPasswordInput(req.body);
    const { password, newPassword } = req.body;

    User.findById(id)
        .then(user => {
            if (!isValid)
                return Promise.reject({
                    status: 400,
                    message: errors
                });

            bcryptjs.compare(password, user.password, (err, isMatch) => {
                if (!isMatch)
                    return res
                        .status(400)
                        .json({ password: 'Password is incorrect!' });

                bcryptjs.genSalt(10, (err, salt) => {
                    if (err) return res.json(err);
                    bcryptjs.hash(newPassword, salt, (err, hash) => {
                        if (err) return res.json(err);
                        user.password = hash;

                        user.save()
                            .then(user => {
                                res.status(204).json(user);
                            })
                            .catch(err => res.json(err));
                    });
                });
            });
        })
        .catch(err => {
            if (!err.status) return res.json(err);

            res.status(err.status).json(err.message);
        });
};

// * Update user info
module.exports.updatePersonalUser = async (req, res) => {
    const { id } = req.params;
    const { errors, isValid } = await ValidatePutPersonalInput(req.body, id);

    User.findById(id)
        .select('-password -__v')
        .then(user => {
            if (!isValid)
                return Promise.reject({
                    status: 400,
                    message: errors
                });

            Object.keys(req.body).forEach(field => {
                user[field] = req.body[field];

                if (field === 'DOB') {
                    user['DOB'] = moment(req.body.DOB).format('DD/MM/YYYY');
                }
            });

            return user.save();
        })
        .then(user => {
            res.status(201).json(user);
        })
        .catch(err => {
            if (!err.status) return res.json(err);

            res.status(err.status).json(err.message);
        });
};

// * Delete user
module.exports.deleteUser = (req, res, next) => {
    const { id } = req.params;

    User.deleteOne({ _id: id })
        .then(result => res.status(200).json(result))
        .catch(err => res.json(err));
};

// * Login
module.exports.login = (req, res, next) => {
    const { email, password } = req.body;

    User.findOne({ email })
        .then(user => {
            if (!user)
                return Promise.reject({
                    status: 400,
                    message: 'Wrong email or password'
                });

            bcryptjs.compare(password, user.password, (err, isMatch) => {
                if (!isMatch)
                    return res.status(404).json('Wrong email or password');

                const payload = {
                    email: user.email,
                    userType: user.userType,
                    id: user._id,
                    fullName: user.fullName,
                    avatar: user.avatar
                };

                jwt.sign(
                    payload,
                    process.env.SECRET_KEY,
                    {
                        expiresIn: 3600
                    },
                    (err, token) => {
                        if (err) res.json(err);

                        res.status(200).json({
                            success: true,
                            token,
                            message: 'Login successfully!'
                        });
                    }
                );
            });
        })
        .catch(err => {
            if (!err.status) return res.json(err);

            res.status(err.status).json(err.message);
        });
};

// * Upload avatar user
module.exports.uploadAvatar = (req, res, next) => {
    const { id } = req.params;

    User.findById(id)
        .then(user => {
            user.avatar = req.file.location;

            return user.save();
        })
        .then(user => {
            res.status(200).json(user);
        })
        .catch(err => {
            res.status(200).json({ message: err.message });
        });
};

// * Get history trip
module.exports.getHistoryTrip = (req, res, next) => {
    const userID = req.user.id;

    Trip.find()
        .populate('driverID')
        .then(trips => {
            let userTripHistory = [];

            _.forEach(trips, trip => {
                _.forEach(trip.passengers, passenger => {
                    if (passenger.passengerID == userID) {
                        userTripHistory.push(trip);
                    }
                });
            });

            res.status(200).json(userTripHistory);
        })
        .catch(err => res.json(err));
};

module.exports.ratingDriver = (req, res, next) => {
    const { userType } = req.user;
    const { id } = req.params;
    const { rate } = req.body;

    User.findById(id)
        .then(res => {
            if (userType !== 'passenger')
                return Promise.reject({
                    status: 400,
                    message: 'Only passenger can rating'
                });

            res.rate = parseInt(rate);

            return res.save();
        })
        .then(user => {
            res.status(201).json(user);
        })
        .catch(err => {
            if (!err.status) return res.json(err);

            res.status(err.status).json(err.message);
        });
};
