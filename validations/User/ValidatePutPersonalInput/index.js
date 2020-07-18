const _ = require('lodash');
const validator = require('validator');
const { User } = require('../../../models/User');

const validatePostInput = async (data, id) => {
    let errors = {};

    data.email = _.get(data, 'email', '');
    data.fullName = _.get(data, 'fullName', '');
    data.phoneNumber = _.get(data, 'phoneNumber', '');
    data.DOB = _.get(data, 'DOB', '');

    // * Email
    if (validator.isEmpty(data.email)) {
        errors.email = 'Email is required';
    } else if (!validator.isEmail(data.email)) {
        errors.email = 'Email invalid';
    } else {
        const user = await User.findOne({
            _id: { $ne: id },
            email: data.email
        });
        if (user) errors.email = 'This email already exists';
    }

    // * Full name
    if (validator.isEmpty(data.fullName)) {
        errors.fullName = 'Full name is required';
    }

    // * Phone number
    if (validator.isEmpty(data.phoneNumber)) {
        errors.phoneNumber = 'Phone number is required';
    } else {
        const user = await User.findOne({
            _id: { $ne: id },
            phoneNumber: data.phoneNumber
        });
        if (user) {
            errors.phoneNumber = 'Phone number already exists';
        }
    }

    // * DOB
    if (validator.isEmpty(data.DOB)) errors.DOB = 'Day of birth is required';

    return {
        isValid: _.isEmpty(errors),
        errors
    };
};

module.exports = validatePostInput;
