import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getUsers, getPosts } from "../api/apiClient";
import "../CSS/ProfilePage.css"

export default function ProfilePage() {
    const { id } = useParams(); 
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);

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
                {posts.map((p) => (
                    <div key={p.id} className="post-card">
                        <p>{p.content}</p>

                        <div class="profilepage-post">
                            <small>
                                Author: {p.username} | Created: {new Date(p.createdAt).toLocaleString()}
                            </small>

                            <Link to={`/posts/${p.id}/comments?profileId=${p.userId}`}>
                                <button className="comments-btn">
                                    Comments
                                </button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
