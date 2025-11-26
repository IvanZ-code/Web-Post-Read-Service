import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getPosts, createPost, deletePost, getProfile } from "../api/apiClient";

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
        <div style={{ maxWidth: "600px", margin: "20px auto" }}>
            <h2>Hello, {user.username}</h2>

            {/* Отображение профиля */}
            <div style={{ marginBottom: "20px" }}>
                {profile.fullName && <p><strong>Full Name:</strong> {profile.fullName}</p>}
                {profile.bio && <p><strong>Bio:</strong> {profile.bio}</p>}
                {profile.avatarUrl && (
                    <p>
                        <img src={profile.avatarUrl} alt="avatar" style={{ width: "50px", borderRadius: "50%" }} />
                    </p>
                )}
            </div>

            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                <Link to="/login"><button>Re-Enter</button></Link>
                <Link to="/search"><button>Find people</button></Link>
                <Link to="/changeuserprofile"><button>Edit Profile</button></Link>
            </div>

            <div>
                <textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost({ content: e.target.value })}
                    placeholder="Whats up?"
                    style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
                />
                <button onClick={handleCreatePost}>Create post</button>
            </div>

            <div style={{ marginTop: "30px" }}>
                <h3>Your posts</h3>
                {posts.length === 0 && <p>No posts yet(</p>}
                {posts.map((p) => (
                    <div
                        key={p.id}
                        style={{ border: "1px solid #ccc", margin: "10px 0", padding: "10px" }}
                    >
                        <p>{p.content}</p>
                        <small>
                            Author: {p.username} | Created: {new Date(p.createdAt).toLocaleString()}
                        </small>

                        <div style={{ marginTop: "10px" }}>
                            <button
                                onClick={() => handleDeletePost(p.id)}
                                style={{ padding: "4px 8px", fontSize: "12px", cursor: "pointer" }}
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
