import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGame } from '../hooks/useGame';
import { useAuthContext } from '../context/AuthContext';
import { useReview } from '../hooks/useReview';
import { useUser } from '../hooks/useUser';
import '../css/game-details-page.css';

const ReviewItem = ({ review }) => {
    const { fetchUser } = useUser();
    const [username, setUsername] = useState(`User #${review.userId.substring(0, 5)}`);

    useEffect(() => {
        const getName = async () => {
            const res = await fetchUser(review.userId);
            if (res.success && res.data) {
                const name = res.data.username || res.data.user_name || res.data.name;
                if (name) setUsername(name);
            }
        };
        getName();
    }, [review.userId, fetchUser]);

    return (
        <div className="review-item">
            <div className="review-header">
                <strong className="review-username">{username}</strong>
                <span className="review-stars">
                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                </span>
            </div>
            <p className="review-text">{review.review}</p>
        </div>
    );
};

const GameDetailsPage = () => {
    const { id } = useParams();
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
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            setIsInCart(cart.some(item => item.id.toString() === id.toString()));

            if (user) {
                const libRes = await getLibrary();
                if (libRes && libRes.data) {
                    const owned = libRes.data.some(libGame => {
                        const libId = (libGame.id || libGame.gameId || "").toString().toLowerCase();
                        return libId === id.toString().toLowerCase();
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
        window.dispatchEvent(new Event('storage'));
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        const res = await addReview({ gameId: id, rating: userRating, review: userComment });
        if (res.success) {
            setUserComment('');
            fetchReviews(id);
            alert("Review submitted!");
        }
    };

    if (gameLoading) return <div className="game-details-loading">Loading game details...</div>;
    if (error || !game) return <div className="game-details-loading">Game not found.</div>;

    const isDeveloper = user?.userId === game.ownerId;
    const hasReviewed = reviews.some(r => r.userId === user?.userId);
    const canDownload = isOwned || isDeveloper;
    const canReview = isOwned && !isDeveloper && !hasReviewed;

    return (
        <div className="gd-container">
            <div className="gd-main-content">
                <img
                    src={game.imagePath || game.image_path || 'https://via.placeholder.com/300x400'}
                    alt={game.title}
                    className="gd-poster"
                />

                <div className="gd-info-pane">
                    <h1 className="gd-title">{game.title}</h1>

                    <div className="gd-meta-row">
                        <span className="gd-rating">★ {game.rating || '0.0'}</span>
                        <span className="gd-review-count">({reviews.length} reviews)</span>
                        {isOwned && <span className="gd-owned-badge">✓ OWNED</span>}
                    </div>

                    <p className="gd-description">{game.description}</p>

                    <div className="gd-price-card">
                        <p><strong>Downloads:</strong> {game.downloads_count || 0}</p>
                        <h2 className="gd-price-tag">
                            {game.price > 0 ? `$${game.price}` : 'FREE'}
                        </h2>
                    </div>

                    <div className="gd-actions">
                        {canDownload ? (
                            <button onClick={handleDownload} disabled={isDownloading} className="btn-gd-primary btn-download">
                                {isDownloading ? "Preparing..." : "Download Now"}
                            </button>
                        ) : (
                            !isDeveloper && (
                                <button onClick={handleCartToggle} className={`btn-gd-primary ${isInCart ? 'btn-remove' : 'btn-add'}`}>
                                    {isInCart ? "Remove from Cart" : "Add to Cart"}
                                </button>
                            )
                        )}

                        {isDeveloper && (
                            <button onClick={() => navigate(`/game/edit/${game.id}`)} className="btn-gd-secondary">
                                Edit Metadata
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <hr className="gd-divider" />

            <section className="gd-reviews-section">
                <h2 className="section-title">Community Reviews</h2>

                {canReview && (
                    <div className="gd-review-form-container">
                        <h3>Rate your experience</h3>
                        <form onSubmit={handleReviewSubmit}>
                            <div className="gd-form-group">
                                <label>Star Rating</label>
                                <select value={userRating} onChange={(e) => setUserRating(e.target.value)} className="gd-select">
                                    {[5,4,3,2,1].map(num => <option key={num} value={num}>{num} Stars</option>)}
                                </select>
                            </div>
                            <div className="gd-form-group">
                                <label>Your Comment</label>
                                <textarea
                                    value={userComment}
                                    onChange={(e) => setUserComment(e.target.value)}
                                    placeholder="What did you think of the gameplay?"
                                    className="gd-textarea"
                                    required
                                />
                            </div>
                            <button type="submit" disabled={reviewLoading} className="btn-gd-submit">
                                {reviewLoading ? "Posting..." : "Post Review"}
                            </button>
                        </form>
                    </div>
                )}

                <div className="reviews-list">
                    {reviews.length > 0 ? (
                        reviews.map((rev) => <ReviewItem key={rev.id} review={rev} />)
                    ) : (
                        <p className="no-reviews">No reviews yet. Be the first to play!</p>
                    )}
                </div>
            </section>
        </div>
    );
};

export default GameDetailsPage;