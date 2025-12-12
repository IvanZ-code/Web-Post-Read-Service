/* eslint-disable no-unused-vars */
import { useState } from "react";
import { createUser } from "../api/apiClient";
import { useNavigate, Link } from "react-router-dom";
import "../CSS/Register.css"

export default function Register() {
    const navigate = useNavigate();
    const [user, setUser] = useState({ username: "", email: "", password: "" });
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        try {
            const response = await createUser({
                Username: user.username,
                Email: user.email,
                PasswordHash: user.password
            });

            navigate("/login");
        } catch (err) {
            setError(err.message || "Something went wrong.");
        }
        
    };

    return (
        <div className="register-page">
            <form onSubmit={handleSubmit} className="register-form">
                <h2>Registration</h2>

                <input
                    required placeholder="Username"
                    minLength={4}
                    value={user.username}
                    onChange={e => setUser({ ...user, username: e.target.value.toLowerCase() })}
                    className="form-input"
                />

                <input
                    required placeholder="Email"
                    value={user.email}
                    onChange={e => setUser({ ...user, email: e.target.value })}
                    className="form-input"
                />

                <input
                    type="password"
                    minLength={4}
                    required placeholder="Password"
                    value={user.password}
                    onChange={e => setUser({ ...user, password: e.target.value })}
                    className="form-input"
                />

                <button type="submit" className="btn-primary">Register</button>
            </form>

            <div className="login-link">
                <Link to="/login">
                    <button className="btn-secondary">Enter</button>
                </Link>
            </div>

            {error && <p className="error-message">{error}</p>}
        </div>
    );
}
