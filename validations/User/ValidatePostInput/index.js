const _ = require('lodash');
const validator = require('validator');
const { User } = require('../../../models/User');

const validatePostInput = async data => {
    let errors = {};

    data.email = _.get(data, 'email', '');
    data.fullName = _.get(data, 'fullName', '');
    data.password = _.get(data, 'password', '');
    data.verifyPassword = _.get(data, 'verifyPassword', '');
    data.phoneNumber = _.get(data, 'phoneNumber', '');
    data.DOB = _.get(data, 'DOB', '');
    data.userType = _.get(data, 'userType', '');

    // * Email
    if (validator.isEmpty(data.email)) {
        errors.email = 'Email is required';
    } else if (!validator.isEmail(data.email)) {
        errors.email = 'Email invalid';
    } else {
        const user = await User.findOne({ email: data.email });
        if (user) errors.email = 'This email already exists';
    }

    // * Full name
    if (validator.isEmpty(data.fullName)) {
        errors.fullName = 'Full name is required';
    }

    // * Password
    if (validator.isEmpty(data.password)) {
        errors.password = 'Password is required';
    } else if (!validator.isLength(data.password, { min: 3 })) {
        errors.password = 'Password at least 3 characters';
    }

    // * Verify password
    if (validator.isEmpty(data.verifyPassword)) {
        errors.verifyPassword = 'Verify password is required';
    } else if (!validator.equals(data.password, data.verifyPassword)) {
        errors.verifyPassword = 'Passwords must match';
    }

    // * Phone number
    if (validator.isEmpty(data.phoneNumber)) {
        errors.phoneNumber = 'Phone number is required';
    } else {
        const phoneNumber = await User.findOne({ phoneNumber: data.phoneNumber });
        if (phoneNumber) errors.phoneNumber = 'This phone number already exists';
    }

    // * DOB
    if (validator.isEmpty(data.DOB)) errors.DOB = 'Day of birth is required';

    // * User type
    if (validator.isEmpty(data.userType)) {
        errors.userType = 'User type is required';
    } else if (
        !validator.equals(data.userType, 'driver') &&
        !validator.equals(data.userType, 'passenger') &&
        !validator.equals(data.userType, 'admin')
    ) {
        errors.userType = 'User type invalid';
    }

    return {
        isValid: _.isEmpty(errors),
        errors
    };
};

module.exports = validatePostInput;
