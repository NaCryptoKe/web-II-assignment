const gameModel = require('../models/gameModel');
const supabase = require('../config/supabaseClient'); // Fixed: Added missing import

const getGameByIdController = async (req, res) => {
    const { id } = req.params;

    try {
        const game = await gameModel.getGameById(id);

        if (!game) {
            return res.status(404).json({
                success: false,
                message: "Game not found."
            });
        }

        res.status(200).json({
            success: true,
            message: "Game retrieved successfully.",
            data: game
        });
    } catch (error) {
        console.error("Get Game By Id Error:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while retrieving the game.",
            errors: [error.message]
        });
    }
};

const uploadGame = async (req, res) => {
    try {
        const { title, description, price } = req.body;
        const ownerId = req.user.userId;

        // Validation: Files check
        if (!req.files || !req.files.game) {
            return res.status(400).json({ 
                success: false,
                message: "Game binary file is required",
                errors: []
            });
        }

        // Internal Helper for Supabase
        const uploadToSupabase = async (file, folder) => {
            const fileKey = `${folder}/${Date.now()}_${file.originalname}`;
            const { data, error } = await supabase.storage
                .from(process.env.SUPABASE_BUCKET)
                .upload(fileKey, file.buffer, {
                    contentType: file.mimetype,
                    duplex: 'half',
                    upsert: true
                });
            
            if (error) throw error;
            // For games, we store the PATH (data.path). For images, we store the URL.
            return folder === 'binaries' 
                ? data.path 
                : supabase.storage.from(process.env.SUPABASE_BUCKET).getPublicUrl(fileKey).data.publicUrl;
        };

        const filePath = await uploadToSupabase(req.files.game[0], 'binaries');
        let imagePath = null;
        if (req.files.image) {
            imagePath = await uploadToSupabase(req.files.image[0], 'thumbnails');
        }

        // Create in Database using the model
        const newGame = await gameModel.createGame(
            title,
            description,
            price,
            ownerId,
            filePath, // This is the storage path (key)
            imagePath // This is the public URL
        );

        res.status(201).json({
            success: true,
            message: "Game uploaded successfully and is pending review.",
            data: newGame
        });

    } catch (error) {
        console.error("Upload Game Error:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while uploading.",
            errors: [error.message]
        });
    }
};

const downloadGame = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;

    try {
        const game = await gameModel.getGameById(id);

        if (!game) {
            return res.status(404).json({ success: false, message: "Game not found." });
        }

        // --- ACCESS CONTROL ---
        let hasAccess = false;
        if (userRole === 'admin' || game.ownerId === userId) {
            hasAccess = true;
        } else {
            hasAccess = await gameModel.checkLibraryAccess(userId, id);
        }
        
        if (!hasAccess) {
            return res.status(403).json({ success: false, message: "Access denied. Purchase required or insufficient privileges." });
        }

        const storagePath = game.filePath;

        if (!storagePath) {
            return res.status(400).json({ success: false, message: "Game file path not found in database." });
        }

        const { data, error } = await supabase.storage
            .from(process.env.SUPABASE_BUCKET)
            .createSignedUrl(storagePath, 300);

        if (error) throw error;

        res.status(200).json({
            success: true,
            downloadUrl: data.signedUrl
        });
    } catch (error) {
        console.error("Download Error:", error);
        res.status(500).json({ success: false, message: "An error occurred during download.", errors: [error.message] });
    }
};

const updateGame = async (req, res) => {
    const { id } = req.params;
    const { title, description, price } = req.body;
    const ownerId = req.user.userId;

    try {
        const game = await gameModel.getGameById(id);

        if (!game) {
            return res.status(404).json({ success: false, message: "Game not found." });
        }

        if (game.ownerId !== ownerId) {
            return res.status(403).json({ success: false, message: "Unauthorized." });
        }

        const updatedGame = await gameModel.updateGame(id, title, description, price);
        res.status(200).json({
            success: true,
            message: "Game updated successfully.",
            data: updatedGame
        });
    } catch (error) {
        res.status(500).json({ success: false, errors: [error.message] });
    }
};

const getUploadedGames = async (req, res) => {
    const ownerId = req.user.userId;
    try {
        const games = await gameModel.getGamesByOwner(ownerId);
        res.status(200).json({ success: true, data: games });
    }  catch (error) {
        res.status(500).json({ success: false, errors: [error.message] });
    }
};

const getLibrary = async (req, res) => {
    const userId = req.user.userId;
    try {
        const games = await gameModel.getGamesInUserLibrary(userId);
        res.status(200).json({ success: true, data: games });
    }  catch (error) {
        res.status(500).json({ success: false, errors: [error.message] });
    }
};

// gameController.js
const searchGames = async (req, res) => {
    const { searchTerm, minPrice, maxPrice, sortBy, order } = req.query;

    try {
        // We pass the whole object to the model
        const games = await gameModel.searchGames({
            searchTerm,
            minPrice: minPrice ? parseFloat(minPrice) : undefined,
            maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
            sortBy, 
            order
        });
        console.log(games)

        res.status(200).json({ success: true, data: games });
    } catch (error) {
        res.status(500).json({ success: false, errors: [error.message] });
    }
};

module.exports = {
    getGameByIdController,
    uploadGame,
    downloadGame,
    updateGame,
    getUploadedGames,
    getLibrary,
    searchGames
};