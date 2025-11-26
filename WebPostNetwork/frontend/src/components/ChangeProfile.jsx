import { useNavigate, Link } from "react-router-dom";
import { updateProfile } from "../api/apiClient";
import { useState } from "react";

export default function ChangeProfile() {
    const navigate = useNavigate();
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    // Ќовое состо€ние дл€ формы, полностью независимое
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
        <div style={{ maxWidth: "600px", margin: "20px auto" }}>

            <div style={{ marginBottom: "10px" }}>
                <Link to="/userprofile">
                    <button>Back to profile</button>
                </Link>
            </div>
            
            <h2>Edit Profile</h2>

            <div style={{ marginBottom: "10px" }}>
                <label>Full Name</label>
                <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter full name"
                    style={{ width: "100%", padding: "8px", marginTop: "4px" }}
                />
            </div>

            <div style={{ marginBottom: "10px" }}>
                <label>Bio</label>
                <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Enter bio"
                    style={{ width: "100%", padding: "8px", marginTop: "4px" }}
                />
            </div>

            <div style={{ marginBottom: "10px" }}>
                <label>Avatar URL</label>
                <input
                    type="text"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="Enter avatar URL"
                    style={{ width: "100%", padding: "8px", marginTop: "4px" }}
                />
            </div>

            <button onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save"}
            </button>
        </div>
    );
}
