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

/**
 * Controller to handle password updates
 * Ensures old password is correct before hashing and saving the new one
 */
const updatePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.userId;
    const userEmail = req.user.email; // Extracted from your auth middleware

    // 1. Validation
    if (!oldPassword || !newPassword) {
        return res.status(400).json({
            success: false,
            message: "Old password and new password are required.",
            errors: []
        });
    }

    try {
        // 2. Fetch user to get the current stored hash
        // Note: Ensure userModel.login returns the field 'password_hash'
        const user = await userModel.login(userEmail); 
        console.log(user)

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        // 3. Compare old password with stored hash
        // IMPORTANT: Check if your DB returns 'password_hash' or 'passwordHash'
        const currentHash = user.passwordHash;
        
        const isMatch = await bcrypt.compare(oldPassword, currentHash);
        console.log(isMatch)

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid old password.",
                errors: []
            });
        }

        // 4. Hash the new password
        const saltRounds = 10;
        const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

        // 5. Execute Update
        const result = await userModel.updatePassword(userId, newPasswordHash);

        // 6. Final Response
        if (result) {
            console.log(`Password updated successfully for User ID: ${userId}`);
            return res.status(200).json({
                success: true,
                message: "Password updated successfully."
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Failed to update password. User might not exist.",
                errors: []
            });
        }

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
