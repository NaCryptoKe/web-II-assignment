const reviewModel = require('../models/reviewModel');
const gameModel = require('../models/gameModel');

const createReview = async (req, res) => {
    const { gameId, rating, review } = req.body;
    const userId = req.user.userId;

    if (!gameId || !rating) {
        return res.status(400).json({
            success: false,
            message: "Game ID and rating are required.",
            errors: []
        });
    }

    try {
        const newReview = await reviewModel.createReview(gameId, userId, rating, review);
        await gameModel.addRating(gameId, rating);

        res.status(201).json({
            success: true,
            message: "Review created successfully.",
            data: newReview
        });
    } catch (error) {
        console.error("Create Review Error:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while creating the review.",
            errors: [error.message]
        });
    }
};

const getGameReviews = async (req, res) => {
    const { gameId } = req.params;

    try {
        const reviews = await reviewModel.getReviewsByGameId(gameId);
        res.status(200).json({
            success: true,
            message: "Game reviews retrieved successfully.",
            data: reviews
        });
    } catch (error) {
        console.error("Get Game Reviews Error:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while retrieving game reviews.",
            errors: [error.message]
        });
    }
};

const deleteReview = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;

    try {
        const review = await reviewModel.getReviewById(id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found."
            });
        }

        if (review.userId !== userId && userRole !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this review."
            });
        }

        await reviewModel.deleteReview(id);

        res.status(200).json({
            success: true,
            message: "Review deleted successfully."
        });
    } catch (error) {
        console.error("Delete Review Error:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while deleting the review.",
            errors: [error.message]
        });
    }
};

module.exports = {
    createReview,
    getGameReviews,
    deleteReview
};
