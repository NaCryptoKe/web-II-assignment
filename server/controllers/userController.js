const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');

const updateProfile = async (req, res) => {
    const { username, email } = req.body;
    const userId = req.user.userId;

    if (!username || !email) {
        return res.status(400).json({
            success: false,
            message: "Username and email are required.",
            errors: []
        });
    }

    try {
        const updatedUser = await userModel.updateProfile(userId, username, email);
        res.status(200).json({
            success: true,
            message: "Profile updated successfully.",
            data: updatedUser
        });
    } catch (error) {
        console.error("Update Profile Error:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while updating the profile.",
            errors: [error.message]
        });
    }
};

const updatePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.userId;

    if (!oldPassword || !newPassword) {
        return res.status(400).json({
            success: false,
            message: "Old password and new password are required.",
            errors: []
        });
    }

    try {
        const user = await userModel.login(req.user.email); // Use login to get password hash

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.passwordHash);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid old password.",
                errors: []
            });
        }

        const saltRounds = 10;
        const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

        await userModel.updatePassword(userId, newPasswordHash);

        res.status(200).json({
            success: true,
            message: "Password updated successfully."
        });
    } catch (error) {
        console.error("Update Password Error:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while updating the password.",
            errors: [error.message]
        });
    }
};

const deleteUser = async (req, res) => {
    const userId = req.user.userId;

    try {
        await userModel.deleteUser(userId);
        res.status(200).json({
            success: true,
            message: "User deleted successfully."
        });
    } catch (error) {
        console.error("Delete User Error:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while deleting the user.",
            errors: [error.message]
        });
    }
};

const getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await userModel.getUserById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        res.status(200).json({
            success: true,
            message: "User retrieved successfully.",
            data: user
        });
    } catch (error) {
        console.error("Get User By ID Error:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while retrieving the user.",
            errors: [error.message]
        });
    }
};

module.exports = {
    updateProfile,
    updatePassword,
    deleteUser,
    getUserById
};
