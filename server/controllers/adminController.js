const gameModel = require('../models/gameModel');
const userModel = require('../models/userModel');
const orderModel = require('../models/orderModel');

const getAllGames = async (req, res) => {
    try {
        const activeGames = await gameModel.getGamesByStatus('active');
        const rejectedGames = await gameModel.getGamesByStatus('rejected');
        const pendingGames = await gameModel.getGamesByStatus('pending');

        res.status(200).json({
            success: true,
            message: "All games retrieved successfully.",
            data: {
                active: activeGames,
                rejected: rejectedGames,
                pending: pendingGames
            }
        });
    } catch (error) {
        console.error("Get All Games Error:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while retrieving games.",
            errors: [error.message]
        });
    }
};

const acceptGame = async (req, res) => {
    const { id } = req.params;

    try {
        const updatedGame = await gameModel.updateGameStatus(id, 'active');
        if (!updatedGame) {
            return res.status(404).json({ success: false, message: "Game not found." });
        }
        res.status(200).json({
            success: true,
            message: "Game accepted successfully.",
            data: updatedGame
        });
    } catch (error) {
        console.error("Accept Game Error:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while accepting the game.",
            errors: [error.message]
        });
    }
};

const rejectGame = async (req, res) => {
    const { id } = req.params;

    try {
        const updatedGame = await gameModel.updateGameStatus(id, 'rejected');
        if (!updatedGame) {
            return res.status(404).json({ success: false, message: "Game not found." });
        }
        res.status(200).json({
            success: true,
            message: "Game rejected successfully.",
            data: updatedGame
        });
    } catch (error) {
        console.error("Reject Game Error:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while rejecting the game.",
            errors: [error.message]
        });
    }
};

const addTag = async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({
            success: false,
            message: "Tag name is required.",
            errors: []
        });
    }

    try {
        const newTag = await tagModel.createTag(name);
        res.status(201).json({
            success: true,
            message: "Tag added successfully.",
            data: newTag
        });
    } catch (error) {
        console.error("Add Tag Error:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while adding the tag.",
            errors: [error.message]
        });
    }
};

const deleteTag = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedTag = await tagModel.deleteTag(id);
        if (!deletedTag) {
            return res.status(404).json({
                success: false,
                message: "Tag not found."
            });
        }
        res.status(200).json({
            success: true,
            message: "Tag deleted successfully.",
            data: deletedTag
        });
    } catch (error) {
        console.error("Delete Tag Error:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while deleting the tag.",
            errors: [error.message]
        });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.getAllUsers();
        res.status(200).json({
            success: true,
            message: "All users retrieved successfully.",
            data: users
        });
    } catch (error) {
        console.error("Get All Users Error:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while retrieving users.",
            errors: [error.message]
        });
    }
};

const getTotalMoneyPerDay = async (req, res) => {
    try {
        const dailyTotals = await orderModel.getTotalSalesByDay();
        res.status(200).json({
            success: true,
            message: "Total money per day retrieved successfully.",
            data: dailyTotals
        });
    } catch (error) {
        console.error("Get Total Money Per Day Error:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while retrieving total money per day.",
            errors: [error.message]
        });
    }
};

const authenticateAdmin = async (req, res) => {
    res.status(200).json({
        success: true,
        message: "Admin authenticated successfully.",
        data: {
            userId: req.user.userId,
            username: req.user.username,
            email: req.user.email,
            role: req.user.role
        }
    });
};

module.exports = {
    getAllGames,
    acceptGame,
    rejectGame,
    getAllUsers,
    getTotalMoneyPerDay,
    authenticateAdmin
};
