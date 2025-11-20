import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getPosts, createPost } from "../api/apiClient";

export default function UserProfile() {
    const navigate = useNavigate();
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState({ content: "" });

    useEffect(() => {

        if (!user) {
            navigate("/login");
            return;
        }

        const loadPosts = async () => {
            try {
                const data = await getPosts(user.id);
                setPosts(data);
            } catch (err) {
                console.error("Error loading posts:", err);
            }
        };

        loadPosts();
    }, [user, navigate]);

    const handleCreatePost = async () => {
        if (!newPost.content) return;
        try {
            await createPost({ ...newPost, userId: user.id });
            setNewPost({ content: "" });
            const data = await getPosts(user.id);
            setPosts(data);
        } catch (err) {
            console.error("Error creating post:", err);
        }
    };

    if (!user) return null; 

    return (
        <div style={{ maxWidth: "600px", margin: "20px auto" }}>
            <h2>Hello, {user.username}</h2>

            <div style={{ display: "flex", gap: "10px", margin: "20px" }}>
                <Link to="/login">
                    <button>Re-Enter</button>
                </Link>
                <Link to="/search">
                    <button>Find people</button>
                </Link>
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
                    </div>
                ))}
            </div>
        </div>
    );
}
