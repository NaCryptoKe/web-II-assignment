import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../hooks/useGame';
import '../css/browse-page.css';

const BrowsePage = () => {
    const navigate = useNavigate();
    const { searchGames, loading } = useGame();
    const [games, setGames] = useState([]);

    const [filters, setFilters] = useState({
        searchTerm: '',
        minPrice: 0,
        maxPrice: 100,
        sortBy: ['created_at'],
        order: 'DESC'
    });

    const fetchFilteredGames = useCallback(async () => {
        const params = {
            ...filters,
            sortBy: filters.sortBy.join(',')
        };
        const res = await searchGames(params);
        if (res.success) {
            setGames(res.data);
        }
    }, [filters, searchGames]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchFilteredGames();
        }, 400);
        return () => clearTimeout(delayDebounceFn);
    }, [fetchFilteredGames]);

    const handleSortCheckbox = (option) => {
        setFilters(prev => {
            const isAlreadySelected = prev.sortBy.includes(option);
            let newSortBy = isAlreadySelected
                ? prev.sortBy.filter(item => item !== option)
                : [...prev.sortBy, option];

            if (newSortBy.length === 0) newSortBy = ['created_at'];
            return { ...prev, sortBy: newSortBy };
        });
    };

    const handleMinPrice = (e) => {
        const value = Math.min(Number(e.target.value), filters.maxPrice - 10);
        setFilters(prev => ({ ...prev, minPrice: value }));
    };

    const handleMaxPrice = (e) => {
        const value = Math.max(Number(e.target.value), filters.minPrice + 10);
        setFilters(prev => ({ ...prev, maxPrice: value }));
    };

    return (
        <div className="browse-container">
            {/* Sidebar Filters */}
            <aside className="filter-sidebar">
                <h3 className="filter-main-title">Filter & Sort</h3>

                {/* Search Bar */}
                <div className="filter-group">
                    <label className="filter-label">Search Title</label>
                    <input
                        type="text"
                        className="filter-input"
                        placeholder="Search..."
                        value={filters.searchTerm}
                        onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
                    />
                </div>

                {/* Dual Price Slider */}
                <div className="filter-group">
                    <label className="filter-label">Price: ${filters.minPrice} - ${filters.maxPrice}</label>
                    <div className="slider-container">
                        <div className="slider-track"></div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={filters.minPrice}
                            onChange={handleMinPrice}
                            className="thumb thumb--left"
                        />
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={filters.maxPrice}
                            onChange={handleMaxPrice}
                            className="thumb thumb--right"
                        />
                    </div>
                </div>

                {/* Sorting Checkboxes */}
                <div className="filter-group">
                    <label className="filter-label">Sort By:</label>
                    <div className="checkbox-list">
                        {[
                            { id: 'created_at', label: 'Recently Added' },
                            { id: 'downloads_count', label: 'Downloads' },
                            { id: 'price', label: 'Price' },
                            { id: 'rating', label: 'Rating' }
                        ].map(option => (
                            <div key={option.id} className="checkbox-item">
                                <input
                                    type="checkbox"
                                    id={option.id}
                                    checked={filters.sortBy.includes(option.id)}
                                    onChange={() => handleSortCheckbox(option.id)}
                                />
                                <label htmlFor={option.id}>{option.label}</label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Order Direction */}
                <div className="filter-group">
                    <label className="filter-label">Direction:</label>
                    <select
                        className="filter-select"
                        value={filters.order}
                        onChange={(e) => setFilters({...filters, order: e.target.value})}
                    >
                        <option value="DESC">Highest First</option>
                        <option value="ASC">Lowest First</option>
                    </select>
                </div>

                <button
                    className="clear-btn"
                    onClick={() => setFilters({ searchTerm: '', minPrice: 0, maxPrice: 100, sortBy: ['created_at'], order: 'DESC' })}
                >
                    Clear All
                </button>
            </aside>

            {/* Main Content */}
            <main className="browse-main">
                <h2 className="browse-title">Discover Games</h2>
                {loading ? (
                    <div className="browse-loading">Loading...</div>
                ) : (
                    <div className="browse-grid">
                        {games.map(game => (
                            <div
                                key={game.id}
                                className="game-browse-card"
                                onClick={() => navigate(`/game/${game.id}`)}
                            >
                                <img src={game.imagePath || 'https://via.placeholder.com/200x250'} alt={game.title} />
                                <div className="game-browse-info">
                                    <h4>{game.title}</h4>
                                    <div className="game-browse-meta">
                                        <span className="game-browse-rating">★ {game.rating || '0.0'}</span>
                                        <span className="game-browse-price">{game.price > 0 ? `$${game.price}` : 'FREE'}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default BrowsePage;