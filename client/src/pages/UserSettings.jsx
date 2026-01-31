// src/pages/UserSettings.jsx
import React, { useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { useUser } from '../hooks/useUser';
import '../css/settings-page.css';

const UserSettings = () => {
    const { user } = useAuthContext();
    const { updateProfile, updatePassword, deleteAccount, loading, error } = useUser();

    const [profileData, setProfileData] = useState({ username: user?.username || '', email: user?.email || '' });
    const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '' });

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        const res = await updateProfile(profileData);
        if (res.success) alert("Profile updated!");
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        const res = await updatePassword(passwords);
        if (res.success) {
            alert("Password updated!");
            setPasswords({ oldPassword: '', newPassword: '' });
        }
    };

    return (
        <div className="settings-container">
            <h1 className="settings-main-title">Account Settings</h1>

            {error && <div className="settings-error-banner">{error}</div>}

            <div className="settings-grid">
                {/* Profile Section */}
                <div className="settings-card">
                    <h3 className="settings-card-title">Update Profile</h3>
                    <form className="settings-form" onSubmit={handleProfileUpdate}>
                        <div className="settings-input-group">
                            <label>Username</label>
                            <input
                                type="text"
                                value={profileData.username}
                                onChange={e => setProfileData({...profileData, username: e.target.value})}
                            />
                        </div>
                        <div className="settings-input-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                value={profileData.email}
                                onChange={e => setProfileData({...profileData, email: e.target.value})}
                            />
                        </div>
                        <button className="btn-settings-update" type="submit" disabled={loading}>
                            Update Info
                        </button>
                    </form>
                </div>

                {/* Password Section */}
                <div className="settings-card">
                    <h3 className="settings-card-title">Security</h3>
                    <form className="settings-form" onSubmit={handlePasswordUpdate}>
                        <div className="settings-input-group">
                            <label>Old Password</label>
                            <input
                                type="password"
                                value={passwords.oldPassword}
                                onChange={e => setPasswords({...passwords, oldPassword: e.target.value})}
                            />
                        </div>
                        <div className="settings-input-group">
                            <label>New Password</label>
                            <input
                                type="password"
                                value={passwords.newPassword}
                                onChange={e => setPasswords({...passwords, newPassword: e.target.value})}
                            />
                        </div>
                        <button className="btn-settings-update" type="submit" disabled={loading}>
                            Change Password
                        </button>
                    </form>
                </div>

                {/* Danger Zone */}
                <div className="settings-card danger-zone">
                    <h3 className="danger-title">Danger Zone</h3>
                    <p className="danger-text">Once you delete your account, there is no going back. All purchased games and data will be permanently removed.</p>
                    <button
                        className="btn-danger-delete"
                        onClick={() => {
                            if(window.confirm("Are you absolutely sure?")) deleteAccount();
                        }}
                        disabled={loading}
                    >
                        Delete My Account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserSettings;