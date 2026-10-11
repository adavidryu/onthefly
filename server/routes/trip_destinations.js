import express from 'express'
import TripDestinationsController from '../controllers/trip_destinations.js'

const router = express.Router()

router.get('/', TripDestinationsController.getTripsDestinations)
router.get('/trips/:destination_id', TripDestinationsController.getAllTrips)
router.get('/destinations/:trip_id', TripDestinationsController.getAllDestinations)
router.post('/', TripDestinationsController.createTripDestination)

export default router
