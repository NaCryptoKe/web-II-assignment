const express = require('express');
const router = express.Router();
const { updateProfile, updatePassword, deleteUser, getUserById } = require('../controllers/userController');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/:id', getUserById);
router.put('/profile', updateProfile);
router.put('/password', updatePassword);
router.delete('/', deleteUser);

module.exports = router;
