const express = require('express');
const router = express.Router();
const carController = require('./controller');
const { authorize, authenticate } = require('../../../middlewares/auth');

router.post('/', authenticate,authorize(['driver']), carController.createCar);

module.exports = router;
