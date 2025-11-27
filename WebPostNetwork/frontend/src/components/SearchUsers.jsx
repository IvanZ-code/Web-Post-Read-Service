import { useState, useEffect } from "react";
import { getUsers } from "../api/apiClient";
import { Link } from "react-router-dom";
import "../CSS/SearchUsers.css"

export default function SearchUsers() {
    const [query, setQuery] = useState("");
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (query.trim() === "") {
            setUsers([]);
            return;
        }

        const fetchUsers = async () => {
            const data = await getUsers(query);
            setUsers(data);
        };

        fetchUsers();
    }, [query]);

    return (
        <div className="search-page">
            <div className="back-button">
                <Link to="/userprofile">
                    <button className="btn-primary">Back to profile</button>
                </Link>
            </div>

            <input
                type="text"
                placeholder="Enter username..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="search-input"
            />

            {users.length > 0 && (
                <ul className="users-list">
                    {users.map((u) => (
                        <li key={u.id} className="user-item">
                            <span>{u.username}</span>
                            <Link to={`/profile/${u.id}`}>
                                <button className="btn-secondary">View Profile</button>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
