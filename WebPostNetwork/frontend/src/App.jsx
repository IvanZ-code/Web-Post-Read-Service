import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import UserProfile from "./components/UserProfile";
import SearchUsers from "./components/SearchUsers";
import ProfilePage from "./components/ProfilePage";
import ChangeProfile from "./components/ChangeProfile";
import CommentsPage from "./components/CommentsPage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/userprofile" element={<UserProfile />} />
                <Route path="/search" element={<SearchUsers />} />
                <Route path="/profile/:id" element={<ProfilePage />} />
                <Route path="/changeuserprofile" element={<ChangeProfile />} />
                <Route path="/posts/:postId/comments" element={<CommentsPage />} />
            </Routes>
        </Router>
    );
}

export default App;
