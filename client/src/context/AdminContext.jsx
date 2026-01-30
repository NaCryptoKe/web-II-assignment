import { createContext, useState, useContext } from 'react';

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
    const [games, setGames] = useState({ active: [], pending: [], rejected: [] });
    const [users, setUsers] = useState([]);
    const [tags, setTags] = useState([]);
    const [revenue, setRevenue] = useState([]);
    const [adminLoading, setAdminLoading] = useState(false);

    return (
        <AdminContext.Provider value={{ 
            games, setGames, 
            users, setUsers, 
            tags, setTags, 
            revenue, setRevenue,
            adminLoading, setAdminLoading 
        }}>
            {children}
        </AdminContext.Provider>
    );
};