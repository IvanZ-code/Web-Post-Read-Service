import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import UserProfile from "./components/UserProfile";
import SearchUsers from "./components/SearchUsers";
import ProfilePage from "./components/ProfilePage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/userprofile" element={<UserProfile />} />
                <Route path="/search" element={<SearchUsers />} />
                <Route path="/profile/:id" element={<ProfilePage /> } />
            </Routes>
        </Router>
    );
}

export default App;
