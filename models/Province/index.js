const mongoose = require('mongoose');

const ProvinceSchema = new mongoose.Schema({
    SolrID: String,
    ID: Number,
    Title: String,
});

const Province = mongoose.model('Province', ProvinceSchema, 'Province');

module.exports = {
    ProvinceSchema,
    Province
};
