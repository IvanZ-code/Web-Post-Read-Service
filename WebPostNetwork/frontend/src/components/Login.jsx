import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/apiClient";
import "../CSS/Login.css"

export default function Login() {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ username: "", password: "" });
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");

        try {
            const user = await loginUser(credentials);

            if (!user) {
                setError("Invalid username or password");
                return;
            }

            localStorage.setItem("user", JSON.stringify(user));
            navigate("/userprofile");
        } catch (err) {
            setError(err.message || "Something went wrong.");
        }
    };

    return (
        <div className="login-page">
            <form onSubmit={handleLogin} className="login-form">
                <h2>Authentication</h2>

                <input
                    required placeholder="Username"
                    value={credentials.username}
                    onChange={e => setCredentials({ ...credentials, username: e.target.value })}
                    className="form-input"
                />

                <input
                    type="password"
                    required placeholder="Password"
                    value={credentials.password}
                    onChange={e => setCredentials({ ...credentials, password: e.target.value })}
                    className="form-input"
                />

                <button type="submit" className="btn-primary">Enter</button>
            </form>

            <div className="register-link">
                <Link to="/">
                    <button className="btn-secondary">Register</button>
                </Link>
            </div>

            {error && <p className="error-message">{error}</p>}
        </div>
    );
}
