const express = require('express');
const router = express.Router();
const { getAllGames, getAllUsers, getTotalMoneyPerDay, authenticateAdmin, acceptGame, rejectGame } = require('../controllers/adminController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.use(auth);
router.use(admin);

router.get('/authenticate', authenticateAdmin);

router.get('/games', getAllGames);
router.post('/games/accept/:id', acceptGame);
router.post('/games/reject/:id', rejectGame);
router.get('/users', getAllUsers);
router.get('/revenue', getTotalMoneyPerDay);

module.exports = router;
