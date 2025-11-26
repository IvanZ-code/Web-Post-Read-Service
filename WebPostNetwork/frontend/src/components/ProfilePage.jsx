import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getUsers, getPosts } from "../api/apiClient";

export default function ProfilePage() {
    const { id } = useParams(); 
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);

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
                setPosts(data);
            } catch (err) {
                console.error("Error loading user or posts:", err);
                navigate("/search");
            }
        };

        loadUserAndPosts();
    }, [id, navigate]);

    if (!user) return <p>Loading...</p>;

    return (
        <div style={{ maxWidth: "600px", margin: "20px auto" }}>
            <h2>{user.username}'s Profile</h2>
            {user.fullName && <p>Full Name: {user.fullName}</p>}
            {user.bio && <p>Bio: {user.bio}</p>}
            {user.avatarUrl && (
                <img
                    src={user.avatarUrl}
                    alt="Avatar"
                    style={{ width: "100px", height: "100px", borderRadius: "50%" }}
                />
            )}

            <div style={{ display: "flex", gap: "10px", marginTop  : "20px" }}>
                <Link to="/userprofile">
                    <button>My Profile</button>
                </Link>
                <Link to="/search">
                    <button>Find people</button>
                </Link>
            </div>

            <div style={{ marginTop: "30px" }}>
                <h3>Posts</h3>
                {posts.length === 0 && <p>No posts yet</p>}
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
