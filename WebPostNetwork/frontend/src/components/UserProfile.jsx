import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getPosts, createPost, deletePost, getProfile } from "../api/apiClient";
import "../CSS/UserProfile.css"

export default function UserProfile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState({ content: "" });

    const [profile, setProfile] = useState({
        fullName: "",
        bio: "",
        avatarUrl: ""
    });
    const [profileLoaded, setProfileLoaded] = useState(false);

    // Загрузка профиля один раз
    useEffect(() => {
        if (!user || profileLoaded) return;

        const loadProfile = async () => {
            try {
                const data = await getProfile(user.id);
                if (data) {
                    setProfile({
                        fullName: data.fullName ?? "",
                        bio: data.bio ?? "",
                        avatarUrl: data.avatarUrl ?? ""
                    });
                }
            } catch (err) {
                // Игнорируем ошибки fetch (например, локальный HTTPS падает)
                console.warn("Error loading profile:", err.message);
            } finally {
                setProfileLoaded(true);
            }
        };

        loadProfile();
    }, [user, profileLoaded]);

    // Функция загрузки постов
    const loadPosts = async () => {
        try {
            const data = await getPosts(user.id);
            setPosts(data);
        } catch (err) {
            console.error("Error loading posts:", err);
        }
    };

    // Загрузка постов при монтировании
    useEffect(() => {
        //console.log("useEffect triggered at", new Date().toLocaleTimeString());

        if (!user) return;
        loadPosts();
    }, [user]);

    const handleCreatePost = async () => {
        if (!newPost.content || newPost.content.trim() === "") return;
        try {
            await createPost({ ...newPost, userId: user.id });
            setNewPost({ content: "" });
            await loadPosts(); // обновляем список после создания
        } catch (err) {
            console.error("Error creating post:", err);
        }
    };

    const handleDeletePost = async (postId) => {
        const confirmed = window.confirm("Are you sure you want to delete this post?");
        if (!confirmed) return;

        try {
            await deletePost(postId);
            await loadPosts(); // обновляем список после удаления
        } catch (err) {
            console.error("Error deleting post:", err);
        }
    };

    if (!user) return null;

    return (
        <div className="page">
            <h2>Hello, {user.username}</h2>

            {/* Профиль */}
            <div className="profile-card">
                {profile.fullName && (
                    <p><strong>Full Name:</strong> {profile.fullName}</p>
                )}
                {profile.bio && (
                    <p><strong>Bio:</strong> {profile.bio}</p>
                )}
                {profile.avatarUrl && (
                    <img
                        src={profile.avatarUrl}
                        alt="avatar"
                        className="avatar"
                    />
                )}
            </div>

            {/* Кнопки */}
            <div className="btn-group">
                <Link to="/login"><button className="btn-primary">Re-Enter</button></Link>
                <Link to="/search"><button className="btn-primary">Find people</button></Link>
                <Link to="/changeuserprofile"><button className="btn-primary">Edit Profile</button></Link>
            </div>

            {/* Новый пост */}
            <div className="new-post">
                <textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost({ content: e.target.value })}
                    placeholder="What's up?"
                />
                <button className="btn-primary" onClick={handleCreatePost}>
                    Create post
                </button>
            </div>

            {/* Посты */}
            <div className="posts">
                <h3>Your posts</h3>

                {posts.length === 0 && <p>No posts yet(</p>}

                {posts.map((p) => (
                    <div key={p.id} className="post-card">
                        <p>{p.content}</p>
                        <small>
                            Author: {p.username} - {new Date(p.createdAt).toLocaleString()}
                        </small>

                        <div className="post-actions">
                            <button
                                className="btn-delete"
                                onClick={() => handleDeletePost(p.id)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
