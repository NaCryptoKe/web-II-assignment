import { useContext } from 'react';
import { AdminContext } from '../context/AdminContext';
import * as adminService from '../services/adminService';

export const useAdmin = () => {
    const context = useContext(AdminContext);
    if (!context) throw new Error("useAdmin must be used within an AdminProvider");

    const { setGames, setUsers, setTags, setRevenue, setAdminLoading } = context;

    const refreshDashboard = async () => {
        setAdminLoading(true);
        try {
            const [gamesRes, usersRes, tagsRes, revRes] = await Promise.all([
                adminService.fetchAllGames(),
                adminService.fetchAllUsers(),
                adminService.fetchAllTags(),
                adminService.fetchRevenueData()
            ]);

            if (gamesRes.success) setGames(gamesRes.data);
            if (usersRes.success) setUsers(usersRes.data);
            if (tagsRes.success) setTags(tagsRes.data);
            if (revRes.success) setRevenue(revRes.data);
        } catch (err) {
            console.error("Dashboard Load Error:", err);
        } finally {
            setAdminLoading(false);
        }
    };

    const handleAcceptGame = async (id) => {
        const res = await adminService.acceptGame(id);
        if (res.success) refreshDashboard();
        return res;
    };

    return {
        ...context,
        refreshDashboard,
        handleAcceptGame
    };
};