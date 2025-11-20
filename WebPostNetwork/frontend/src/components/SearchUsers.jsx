import { useState, useEffect } from "react";
import { getUsers } from "../api/apiClient";
import { Link } from "react-router-dom";

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

        <div style={{ maxWidth: "400px", margin: "20px auto" }}>

            <div style={{ margin: "10px" }}>
                <Link to="/userprofile">
                    <button>My Profile</button>
                </Link>
            </div>

            <input
                type="text"
                placeholder="Enter username..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{
                    width: "100%",
                    padding: "10px",
                    fontSize: "16px",
                    marginBottom: "15px",
                }}
            />

            {users.length > 0 && (
                <ul style={{ padding: 0, listStyle: "none" }}>
                    {users.map((u) => (
                        <li
                            key={u.id}
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: "10px",
                                borderBottom: "1px solid #ccc",
                            }}
                        >
                            <span>{u.username}</span>
                            <Link to={`/profile/${u.id}`}>
                                <button style={{ padding: "5px 10px" }}>View Profile</button>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
