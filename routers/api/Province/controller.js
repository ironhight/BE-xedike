const { Province } = require('../../../models/Province');

module.exports.getProvinces = (req, res, next) => {
    Province.find()
        .then(provinces => {
            res.status(200).json(provinces);
        })
        .catch(err => res.json(err));
};