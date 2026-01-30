// src/pages/UserSettings.jsx
import React, { useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { useUser } from '../hooks/useUser';

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
        <div style={{ padding: '20px', maxWidth: '400px' }}>
            <h1>Settings</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Profile Section */}
            <form onSubmit={handleProfileUpdate}>
                <h3>Update Profile</h3>
                <input type="text" placeholder="Username" value={profileData.username} onChange={e => setProfileData({...profileData, username: e.target.value})} /><br/>
                <input type="email" placeholder="Email" value={profileData.email} onChange={e => setProfileData({...profileData, email: e.target.value})} /><br/>
                <button type="submit" disabled={loading}>Update Info</button>
            </form>

            <hr />

            {/* Password Section */}
            <form onSubmit={handlePasswordUpdate}>
                <h3>Update Password</h3>
                <input type="password" placeholder="Old Password" value={passwords.oldPassword} onChange={e => setPasswords({...passwords, oldPassword: e.target.value})} /><br/>
                <input type="password" placeholder="New Password" value={passwords.newPassword} onChange={e => setPasswords({...passwords, newPassword: e.target.value})} /><br/>
                <button type="submit" disabled={loading}>Change Password</button>
            </form>

            <hr />

            {/* Danger Zone */}
            <section style={{ marginTop: '40px', padding: '15px', border: '1px solid red' }}>
                <h3 style={{ color: 'red' }}>Danger Zone</h3>
                <p>Once you delete your account, there is no going back.</p>
                <button 
                    onClick={deleteAccount} 
                    style={{ backgroundColor: 'red', color: 'white' }}
                    disabled={loading}
                >
                    Delete My Account
                </button>
            </section>
        </div>
    );
};

export default UserSettings;