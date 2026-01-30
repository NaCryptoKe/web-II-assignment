const express = require('express');
const router = express.Router();
const { createReview, getGameReviews, deleteReview } = require('../controllers/reviewController');
const auth = require('../middleware/auth');

router.use(auth);

router.post('/', createReview);

router.get('/game/:gameId', getGameReviews);

router.delete('/:id', deleteReview);

module.exports = router;
