import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/apiClient";

export default function Login() {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ username: "", password: "" });

    const handleLogin = async (e) => {
        e.preventDefault();
        const user = await loginUser(credentials);
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/userprofile");
    };

    return (
        <div>
            <form onSubmit={handleLogin}>
            <h2>Authentication</h2>
            <input
                placeholder="Username"
                value={credentials.username}
                onChange={e => setCredentials({ ...credentials, username: e.target.value })}
            />
            <input
                type="password"
                placeholder="Password"
                value={credentials.password}
                onChange={e => setCredentials({ ...credentials, password: e.target.value })}
            />
            <button type="submit">Enter</button>
            </form>

            <div style={{ marginTop: "10px" }}>
                <Link to="/">
                    <button>Register</button>
                </Link>
            </div>


        </div>
    );
}
