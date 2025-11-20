import { useState } from "react";
import { createUser } from "../api/apiClient";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
    const navigate = useNavigate();
    const [user, setUser] = useState({ username: "", email: "", password: "" });

    const handleSubmit = async (e) => {
        e.preventDefault();

        await createUser({
            Username: user.username,
            Email: user.email,
            PasswordHash: user.password
        });

        navigate("/login");
    };

    return (
        <div>
        <form onSubmit={handleSubmit}>
            <h2>Registration</h2>
            <input
                placeholder="Username"
                value={user.username}
                onChange={e => setUser({ ...user, username: e.target.value })}
            />
            <input
                placeholder="Email"
                value={user.email}
                onChange={e => setUser({ ...user, email: e.target.value })}
            />
            <input
                type="password"
                placeholder="Password"
                value={user.password}
                onChange={e => setUser({ ...user, password: e.target.value })}
            />
            <button type="submit">Register</button>
        </form>

            <div style={{ marginTop: "10px" }}>
                <Link to="/login">
                    <button>Enter</button>
                </Link>
            </div>

        </div>
    );
}
