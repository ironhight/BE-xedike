const express = require('express');
const router = express.Router();
const { authorize, authenticate } = require('../../../middlewares/auth');
const tripController = require('./controller');

router.post(
    '/',
    authenticate,
    authorize(['driver']),
    tripController.createTrips
);
router.get('/count-trip', tripController.getCountTrips);
router.get('/get-all/:limit', tripController.getTrips);
router.post('/count/search?:queryString', tripController.searchCountTrips);
router.post('/search?:queryString', tripController.searchTrips);
router.get('/detail/:id', tripController.getDetailTrip);
// router.post('/:id', tripController.deleteTrip);
router.put('/booking-trip/:id', authenticate, tripController.bookingTrip);
router.put(
    '/finish-trip/:id',
    authenticate,
    authorize(['passenger']),
    tripController.finishTrip
);

module.exports = router;
