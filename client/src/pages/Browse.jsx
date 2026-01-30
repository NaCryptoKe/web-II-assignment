import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../hooks/useGame';

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

    // Price Handlers
    const handleMinPrice = (e) => {
        const value = Math.min(Number(e.target.value), filters.maxPrice - 10);
        setFilters(prev => ({ ...prev, minPrice: value }));
    };

    const handleMaxPrice = (e) => {
        const value = Math.max(Number(e.target.value), filters.minPrice + 10);
        setFilters(prev => ({ ...prev, maxPrice: value }));
    };

    return (
        <div style={{ display: 'flex', padding: '20px', gap: '30px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>
            
            {/* Sidebar Filters */}
            <div style={{ width: '280px', flexShrink: 0, background: '#fff', border: '1px solid #ddd', padding: '20px', borderRadius: '12px', height: 'fit-content', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                <h3 style={{ marginTop: 0 }}>Filter & Sort</h3>
                
                {/* Search Bar */}
                <div style={{ marginBottom: '25px' }}>
                    <label style={{ fontWeight: '600' }}>Search Title</label>
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        value={filters.searchTerm}
                        onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
                        style={{ width: '100%', padding: '10px', marginTop: '8px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                    />
                </div>

                {/* Dual Price Slider */}
                <div style={{ marginBottom: '35px' }}>
                    <label style={{ fontWeight: '600' }}>Price: ${filters.minPrice} - ${filters.maxPrice}</label>
                    <div style={{ position: 'relative', height: '30px', marginTop: '15px' }}>
                        {/* Gray background track */}
                        <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', height: '6px', width: '100%', background: '#eee', borderRadius: '3px', zIndex: 1 }}></div>
                        
                        {/* Minimum Price Slider */}
                        <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            value={filters.minPrice} 
                            onChange={handleMinPrice}
                            className="thumb thumb--left"
                            style={{ zIndex: filters.minPrice > 800 ? 5 : 3 }}
                        />
                        
                        {/* Maximum Price Slider */}
                        <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            value={filters.maxPrice} 
                            onChange={handleMaxPrice}
                            className="thumb thumb--right"
                            style={{ zIndex: 4 }}
                        />
                    </div>
                </div>

                {/* Sorting Checkboxes */}
                <div style={{ marginBottom: '25px' }}>
                    <label style={{ fontWeight: '600' }}>Sort By (Multiple):</label>
                    <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {[
                            { id: 'created_at', label: 'Recently Added' },
                            { id: 'downloads_count', label: 'Downloads' },
                            { id: 'price', label: 'Price' },
                            { id: 'rating', label: 'Rating' }
                        ].map(option => (
                            <div key={option.id} style={{ display: 'flex', alignItems: 'center' }}>
                                <input 
                                    type="checkbox" 
                                    id={option.id} 
                                    checked={filters.sortBy.includes(option.id)}
                                    onChange={() => handleSortCheckbox(option.id)}
                                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                />
                                <label htmlFor={option.id} style={{ marginLeft: '10px', cursor: 'pointer' }}>
                                    {option.label}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Order Direction */}
                <div style={{ marginBottom: '25px' }}>
                    <label style={{ fontWeight: '600' }}>Direction:</label>
                    <select 
                        value={filters.order} 
                        onChange={(e) => setFilters({...filters, order: e.target.value})}
                        style={{ width: '100%', padding: '8px', marginTop: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    >
                        <option value="DESC">Highest First</option>
                        <option value="ASC">Lowest First</option>
                    </select>
                </div>

                <button 
                    onClick={() => setFilters({ searchTerm: '', minPrice: 0, maxPrice: 100, sortBy: ['created_at'], order: 'DESC' })}
                    style={{ width: '100%', padding: '12px', background: '#f0f0f0', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    Clear All
                </button>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1 }}>
                <h2 style={{ marginTop: 0 }}>Discover Games</h2>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '25px' }}>
                        {games.map(game => (
                            <div 
                                key={game.id} 
                                onClick={() => navigate(`/game/${game.id}`)}
                                style={{ cursor: 'pointer', border: '1px solid #eee', borderRadius: '10px', overflow: 'hidden', background: '#fff', transition: '0.2s' }}
                                onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)'}
                                onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
                            >
                                <img src={game.imagePath || 'https://via.placeholder.com/200x250'} alt={game.title} style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
                                <div style={{ padding: '15px' }}>
                                    <h4 style={{ margin: '0 0 10px 0' }}>{game.title}</h4>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: '#f39c12' }}>★ {game.rating || '0.0'}</span>
                                        <span style={{ fontWeight: 'bold' }}>{game.price > 0 ? `$${game.price}` : 'FREE'}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style>{`
                /* General input styling to make them overlap */
                .thumb {
                    pointer-events: none;
                    position: absolute;
                    height: 0;
                    width: 100%;
                    outline: none;
                    appearance: none;
                    background: none;
                }

                /* Styling the slider knobs (thumbs) */
                .thumb::-webkit-slider-thumb {
                    background-color: #007bff;
                    border: 2px solid #fff;
                    border-radius: 50%;
                    box-shadow: 0 0 1px 1px #ced4da;
                    cursor: pointer;
                    height: 18px;
                    width: 18px;
                    margin-top: 4px;
                    pointer-events: all; /* Important: allow interaction only on the knob */
                    appearance: none;
                }

                .thumb::-moz-range-thumb {
                    background-color: #007bff;
                    border: 2px solid #fff;
                    border-radius: 50%;
                    box-shadow: 0 0 1px 1px #ced4da;
                    cursor: pointer;
                    height: 18px;
                    width: 18px;
                    pointer-events: all;
                    appearance: none;
                }
            `}</style>
        </div>
    );
};

export default BrowsePage;