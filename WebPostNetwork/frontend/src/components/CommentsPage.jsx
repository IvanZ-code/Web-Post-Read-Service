import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useNavigate, Link } from "react-router-dom";
import { getComments, createComment, deleteComment } from "../api/apiClient";
import "../CSS/CommentsPage.css"

export default function CommentsPage() {
    const navigate = useNavigate();
    const { postId } = useParams();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [searchParams] = useSearchParams();
    const profileId = parseInt(searchParams.get("profileId"));

    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (!user) {
        navigate("/login");
        return null;
    }


    const loadComments = async () => {
        const data = await getComments(postId);
        setComments(data);
    };

    useEffect(() => {
        loadComments();
    }, [user, postId]);

    const handleSend = async () => {
        if (!newComment.trim()) return;
        console.log({
            content: newComment,
            userId: user.id,
            postId: parseInt(postId)
        });
        await createComment({
            content: newComment,
            userId: user.id,
            postId: parseInt(postId)
        });

        setNewComment("");
        loadComments();
    };
    const handleDelete = async (commentId) => {
        if (!window.confirm("Delete this comment?")) return;
        try {
            await deleteComment(commentId, user.id);
            loadComments();
        } catch (err) {
            alert("Failed to delete comment: " + err.message);
        }
    };
    return (
        <div className="comments-page">
            <Link to={`/profile/${profileId}`}>
                <button className="back-btn">Back to user's profile</button>
            </Link>
            <h2>Comments</h2>

            {comments.length === 0 && <p>No comments yet</p>}

            {comments.map((c) => {
                const canDelete = c.userId === user.id || profileId === user.id;
                //console.log(profileId, user.id);
                //console.log(canDelete);

                return (
                    <div key={c.id} className="comment-card">
                        <p>{c.content}</p>
                        <div className="commentspage-comment">
                            <small>{c.username} | {new Date(c.createdAt).toLocaleString()}</small>
                            {canDelete && (
                                <button
                                    className="btn-delete-comment"
                                    onClick={() => handleDelete(c.id)}
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    </div>
                );
            })}

            <div className="comment-input">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                />
                <button onClick={handleSend} className="send-btn">
                    Send
                </button>
            </div>
        </div>
    );
}
