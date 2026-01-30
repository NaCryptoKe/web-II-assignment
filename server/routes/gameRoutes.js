const express = require('express');
const router = express.Router();
const { 
    uploadGame, 
    updateGame, 
    getUploadedGames, 
    getLibrary, 
    searchGames,
    downloadGame,
    getGameByIdController
} = require('../controllers/gameController');

const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(auth);

// It's important to place this route before other routes that might also capture a single ID,
// like /download/:id, to ensure correct routing order.

router.post(
    '/', 
    upload.fields([
        { name: 'game', maxCount: 1 }, 
        { name: 'image', maxCount: 1 }
    ]), 
    uploadGame
);
router.get('/download/:id', downloadGame);
router.put('/:id', updateGame);
router.get('/my-games', getUploadedGames);
router.get('/library', getLibrary);
router.get('/search', searchGames);

router.get('/:id', getGameByIdController);

module.exports = router;