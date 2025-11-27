import { useNavigate, Link } from "react-router-dom";
import { updateProfile } from "../api/apiClient";
import { useState } from "react";
import "../CSS/ChangeProfile.css"

export default function ChangeProfile() {
    const navigate = useNavigate();
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

   
    const [fullName, setFullName] = useState("");
    const [bio, setBio] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");
    const [saving, setSaving] = useState(false);

    if (!user) {
        navigate("/login");
        return null;
    }

    const handleSave = async () => {
        setSaving(true);
        try {
            const dto = {};
            if (fullName.trim() !== "") dto.fullName = fullName;
            if (bio.trim() !== "") dto.bio = bio;
            if (avatarUrl.trim() !== "") dto.avatarUrl = avatarUrl;

            await updateProfile(user.id, dto);
            alert("Profile updated!");
            navigate("/userprofile");
        } catch (err) {
            console.error("Error updating profile:", err);
            alert("Failed to update profile.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="edit-page">
            <div className="back-button">
                <Link to="/userprofile">
                    <button className="btn-primary">Back to profile</button>
                </Link>
            </div>

            <h2>Edit Profile</h2>

            <div className="form-group">
                <label>Full Name</label>
                <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter full name"
                />
            </div>

            <div className="form-group">
                <label>Bio</label>
                <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Enter bio"
                />
            </div>

            <div className="form-group">
                <label>Avatar URL</label>
                <input
                    type="text"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="Enter avatar URL"
                />
            </div>

            <button className="btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save"}
            </button>
        </div>
    );
}
