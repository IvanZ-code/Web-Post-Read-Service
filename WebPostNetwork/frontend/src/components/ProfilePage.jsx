/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getUsers, getPosts, getPostLikes, addLike, removeLike } from "../api/apiClient";
import "../CSS/ProfilePage.css"

export default function ProfilePage() {
    const { id } = useParams(); 
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [likes, setLikes] = useState({});

    const storedUser = localStorage.getItem("user");
    const stUser = storedUser ? JSON.parse(storedUser) : null;

    useEffect(() => {
        if (stUser && parseInt(id) === stUser.id) {
            navigate("/userprofile", { replace: true });
        }
    }, [id, stUser, navigate]);

  
    if (stUser && parseInt(id) === stUser.id) {
        return null; 
    }


    useEffect(() => {
        
        const loadUserAndPosts = async () => {
            try {
                const allUsers = await getUsers();
                const foundUser = allUsers.find(u => u.id === parseInt(id));

                if (!foundUser) {
                    
                    navigate("/search");
                    return;
                }

                setUser(foundUser);

                const data = await getPosts(foundUser.id);
                setPosts(data || []);

                const likesMap = {};
                await Promise.all((data || []).map(async (p) => {
                    try {
                        const info = await getPostLikes(p.id, stUser?.id);
                        likesMap[p.id] = {
                            count: info.count ?? 0,
                            isLiked: !!info.isLiked,
                            loading: false
                        };
                    // eslint-disable-next-line no-unused-vars
                    } catch (e) {
                        likesMap[p.id] = { count: 0, isLiked: false, loading: false };
                    }
                }));
                setLikes(likesMap);
            } catch (err) {
                console.error("Error loading user or posts:", err);
                navigate("/search");
            }
        };

        loadUserAndPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, navigate]);


    const toggleLike = async (postId) => {
        if (!stUser) {
            navigate("/login");
            return;
        }

        setLikes(prev => ({
            ...prev,
            [postId]: {
                ...(prev[postId] || { count: 0, isLiked: false }),
                loading: true
            }
        }));

        try {
            const current = likes[postId] || { count: 0, isLiked: false };

            if (current.isLiked) {
                // убрать лайк
                await removeLike(postId, stUser.id);
                setLikes(prev => ({
                    ...prev,
                    [postId]: {
                        count: Math.max(0, (prev[postId]?.count ?? 1) - 1),
                        isLiked: false,
                        loading: false
                    }
                }));
            } else {
                // поставить лайк
                await addLike(postId, stUser.id);
                setLikes(prev => ({
                    ...prev,
                    [postId]: {
                        count: (prev[postId]?.count ?? 0) + 1,
                        isLiked: true,
                        loading: false
                    }
                }));
            }
        } catch (err) {
            console.error("ToggleLike error:", err);
            // снять блокировку и не менять статус при ошибке
            setLikes(prev => ({
                ...prev,
                [postId]: {
                    ...(prev[postId] || { count: 0, isLiked: false }),
                    loading: false
                }
            }));
        }
    };


    if (!user) return <p>Loading...</p>;

    return (
        <div className="profile-page">
            <h2>{user.username}'s profile</h2>

            {user.fullName && <p className="profile-info"><strong>Full Name: </strong>{user.fullName}</p>}
            {user.bio && <p className="profile-info"><strong>Bio: </strong>{user.bio}</p>}
            {user.avatarUrl && (
                <img
                    src={user.avatarUrl}
                    alt="Avatar"
                    className="profile-avatar"
                />
            )}

            <div className="btn-group">
                <Link to="/userprofile">
                    <button className="btn-primary">My Profile</button>
                </Link>
                <Link to="/search">
                    <button className="btn-primary">Find people</button>
                </Link>
            </div>

            <div className="posts-section">
                <h3>Posts</h3>
                {posts.length === 0 && <p>No posts yet</p>}
                {posts.map((p) => {
                    const l = likes[p.id] || { count: 0, isLiked: false, loading: false };
                    return (
                        <div key={p.id} className="post-card">
                            <p>{p.content}</p>
                         
                            <small>
                                Author: {p.username} | Created: {new Date(p.createdAt).toLocaleString()}
                            </small>

                            <div className="profilepage-post">
                                <div className="likes-area">
                                    <button
                                        className="like-btn"
                                        onClick={() => toggleLike(p.id)}
                                        disabled={l.loading}
                                        title={l.isLiked ? "Убрать лайк" : "Поставить лайк"}
                                    >
                                        {l.isLiked ? "❤️" : "🤍"}
                                    </button>
                                    <span className="likes-count">{l.count}</span>
                                </div>

                                <Link to={`/posts/${p.id}/comments?profileId=${p.userId}`}>
                                    <button className="comments-btn">
                                        Comments
                                    </button>
                                </Link>

                            </div>

                        </div>
                    );
                })}
            </div>
        </div>
    );
}
