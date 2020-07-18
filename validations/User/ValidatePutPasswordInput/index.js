const _ = require('lodash');
const validator = require('validator');

const validatePostInput = async data => {
    let errors = {};

    data.password = _.get(data, 'password', '');
    data.newPassword = _.get(data, 'newPassword', '');
    data.verifyNewPassword = _.get(data, 'verifyNewPassword', '');

    // * Password
    if (validator.isEmpty(data.password)) {
        errors.password = 'Password is required';
    } else if (!validator.isLength(data.password, { min: 3 })) {
        errors.password = 'Password at least 3 characters';
    }

    // * New password
    if (validator.isEmpty(data.newPassword)) {
        errors.newPassword = 'New password is required';
    } else if (!validator.isLength(data.newPassword, { min: 3 })) {
        errors.newPassword = 'New password at least 3 characters';
    }

    // * Verify new password
    if (validator.isEmpty(data.verifyNewPassword)) {
        errors.verifyNewPassword = 'Verify new password is required';
    } else if (!validator.equals(data.newPassword, data.verifyNewPassword)) {
        errors.verifyNewPassword = 'Verify new passwords must match';
    }

    return {
        isValid: _.isEmpty(errors),
        errors
    };
};

module.exports = validatePostInput;
