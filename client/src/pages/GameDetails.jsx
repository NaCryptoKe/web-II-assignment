import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGame } from '../hooks/useGame';
import { useAuthContext } from '../context/AuthContext';
import { useReview } from '../hooks/useReview';
import { useUser } from '../hooks/useUser';

/**
 * Sub-component to fetch and display the reviewer's username
 */
const ReviewItem = ({ review }) => {
    const { fetchUser } = useUser();
    // Default to a loading state or a truncated version of the UUID
    const [username, setUsername] = useState(`User #${review.userId.substring(0, 5)}`);

    useEffect(() => {
        const getName = async () => {
            const res = await fetchUser(review.userId);
            if (res.success && res.data) {
                // Tries various common field names in case your backend uses different naming
                const name = res.data.username || res.data.user_name || res.data.name;
                if (name) setUsername(name);
            }
        };
        getName();
    }, [review.userId, fetchUser]);

    return (
        <div style={{ borderBottom: '1px solid #eee', paddingBottom: '15px', marginTop: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ color: '#2c3e50' }}>{username}</strong>
                <span style={{ color: '#f39c12' }}>
                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                </span>
            </div>
            <p style={{ color: '#666', marginTop: '10px', lineHeight: '1.5' }}>{review.review}</p>
        </div>
    );
};

const GameDetailsPage = () => {
    const { id } = useParams(); // UUID string from URL
    const navigate = useNavigate();
    const { user } = useAuthContext();
    
    const { fetchGameDetails, downloadGame, getLibrary, loading: gameLoading, error } = useGame();
    const { reviews, fetchReviews, addReview, loading: reviewLoading } = useReview();

    const [game, setGame] = useState(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [userRating, setUserRating] = useState(5);
    const [userComment, setUserComment] = useState('');
    const [isOwned, setIsOwned] = useState(false);
    const [isInCart, setIsInCart] = useState(false);

    const loadPageData = useCallback(async () => {
        const res = await fetchGameDetails(id);
        if (res.success) {
            setGame(res.data);
            fetchReviews(id);
            
            // 1. Cart Check (UUID String Comparison)
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            setIsInCart(cart.some(item => item.id.toString() === id.toString()));

            // 2. Ownership Check (UUID String Comparison)
            if (user) {
                const libRes = await getLibrary();
                if (libRes && libRes.data) {
                    const owned = libRes.data.some(libGame => {
                        const libId = (libGame.id || libGame.gameId || "").toString().toLowerCase();
                        const targetId = id.toString().toLowerCase();
                        return libId === targetId;
                    });
                    setIsOwned(owned);
                }
            }
        }
    }, [id, fetchGameDetails, fetchReviews, getLibrary, user]);

    useEffect(() => {
        loadPageData();
    }, [loadPageData]);

    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            const res = await downloadGame(id);
            if (res.success && res.downloadUrl) {
                const response = await fetch(res.downloadUrl);
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `${game.title || 'game'}.zip`); 
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);
            } else {
                alert("Download failed: " + (res.message || "Link not found"));
            }
        } catch (err) {
            console.error("Download error:", err);
        } finally {
            setIsDownloading(false);
        }
    };

    const handleCartToggle = () => {
        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        if (isInCart) {
            cart = cart.filter(item => item.id.toString() !== id.toString());
            setIsInCart(false);
        } else {
            cart.push({ 
                id: game.id, 
                title: game.title, 
                price: game.price, 
                imagePath: game.imagePath || game.image_path 
            });
            setIsInCart(true);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        window.dispatchEvent(new Event('storage')); // Notify Navbar
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        const res = await addReview({ gameId: id, rating: userRating, review: userComment });
        if (res.success) {
            setUserComment('');
            fetchReviews(id); // Refresh review list
            alert("Review submitted!");
        }
    };

    if (gameLoading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading game details...</div>;
    if (error || !game) return <div style={{ padding: '50px', textAlign: 'center' }}>Game not found.</div>;

    const isDeveloper = user?.userId === game.ownerId;
    const hasReviewed = reviews.some(r => r.userId === user?.userId);
    const canDownload = isOwned || isDeveloper;
    const canReview = isOwned && !isDeveloper && !hasReviewed;

    return (
        <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
            {/* Header / Game Info */}
            <div style={{ display: 'flex', gap: '40px', marginBottom: '60px', flexWrap: 'wrap' }}>
                <img 
                    src={game.imagePath || game.image_path || 'https://via.placeholder.com/300x400'} 
                    alt={game.title} 
                    style={{ width: '350px', height: '450px', objectFit: 'cover', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }} 
                />
                
                <div style={{ flex: 1, minWidth: '300px' }}>
                    <h1 style={{ fontSize: '2.8rem', margin: '0 0 10px 0' }}>{game.title}</h1>
                    
                    <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <span style={{ color: '#f39c12', fontWeight: 'bold', fontSize: '1.2rem' }}>★ {game.rating || '0.0'}</span>
                        <span style={{ color: '#777' }}>({reviews.length} reviews)</span>
                        {isOwned && (
                            <span style={{ padding: '4px 12px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                                ✓ OWNED
                            </span>
                        )}
                    </div>

                    <p style={{ fontSize: '1.15rem', color: '#444', lineHeight: '1.7', marginBottom: '25px' }}>{game.description}</p>
                    
                    <div style={{ marginBottom: '30px', backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '10px' }}>
                        <p style={{ margin: '0 0 10px 0' }}><strong>Total Downloads:</strong> {game.downloads_count || 0}</p>
                        <h2 style={{ margin: 0, color: '#2c3e50' }}>
                            {game.price > 0 ? `$${game.price}` : 'FREE'}
                        </h2>
                    </div>

                    <div style={{ display: 'flex', gap: '15px' }}>
                        {canDownload ? (
                            <button 
                                onClick={handleDownload}
                                disabled={isDownloading}
                                style={{ padding: '16px', backgroundColor: isDownloading ? '#ccc' : '#28a745', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', flex: 2, fontSize: '1rem' }}
                            >
                                {isDownloading ? "Preparing Download..." : "Download Now"}
                            </button>
                        ) : (
                            !isDeveloper && (
                                <button 
                                    onClick={handleCartToggle}
                                    style={{ 
                                        padding: '16px', 
                                        backgroundColor: isInCart ? '#dc3545' : '#007bff', 
                                        color: '#fff', 
                                        border: 'none', 
                                        borderRadius: '8px', 
                                        fontWeight: 'bold', 
                                        cursor: 'pointer',
                                        flex: 2,
                                        fontSize: '1rem'
                                    }}
                                >
                                    {isInCart ? "Remove from Cart" : "Add to Cart"}
                                </button>
                            )
                        )}

                        {isDeveloper && (
                            <button 
                                onClick={() => navigate(`/game/edit/${game.id}`)}
                                style={{ padding: '16px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', flex: 1 }}
                            >
                                Edit Metadata
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '40px 0' }} />

            {/* Review Section */}
            <div>
                <h2 style={{ marginBottom: '30px' }}>Community Reviews</h2>

                {canReview ? (
                    <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', marginBottom: '40px', border: '1px solid #e1e4e8', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ marginTop: 0 }}>Rate your experience</h3>
                        <form onSubmit={handleReviewSubmit}>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Star Rating</label>
                                <select value={userRating} onChange={(e) => setUserRating(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd', width: '150px' }}>
                                    {[5,4,3,2,1].map(num => <option key={num} value={num}>{num} Stars</option>)}
                                </select>
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Your Comment</label>
                                <textarea 
                                    value={userComment}
                                    onChange={(e) => setUserComment(e.target.value)}
                                    placeholder="What did you think of the gameplay?"
                                    style={{ width: '100%', height: '120px', padding: '15px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none', fontFamily: 'inherit' }}
                                    required
                                />
                            </div>
                            <button type="submit" disabled={reviewLoading} style={{ padding: '12px 30px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                                {reviewLoading ? "Posting..." : "Post Review"}
                            </button>
                        </form>
                    </div>
                ) : (
                    isOwned && hasReviewed && (
                        <div style={{ padding: '20px', backgroundColor: '#eefcf1', borderRadius: '8px', color: '#155724', marginBottom: '30px', fontWeight: '500' }}>
                            You've submitted a review for this game.
                        </div>
                    )
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {reviews.length > 0 ? (
                        reviews.map((rev) => <ReviewItem key={rev.id} review={rev} />)
                    ) : (
                        <p style={{ color: '#888', fontStyle: 'italic', textAlign: 'center', padding: '40px' }}>No reviews yet. Be the first to play!</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GameDetailsPage;