import React, { useState, useEffect } from "react";
import axios from "axios";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import { FaEdit, FaTrash } from "react-icons/fa";
import { timeAgo } from "../utility/timeAgo";
import "../comments.css";
import { emojis } from "../utility/emojis";

export default function Comments({ video }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [showEmojis, setShowEmojis] = useState(false); // Emoji picker toggle

  const token = localStorage.getItem("token");

  // Fetch comments
  useEffect(() => {
    if (!video || !video.id) return;

    const fetchComments = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/comments/${video.id}`
        );
        const commentsWithLikes = res.data.map((c) => ({
          ...c,
          id: c._id,
          likes: Math.floor(Math.random() * 50),
          dislikes: Math.floor(Math.random() * 20),
          liked: false,
          disliked: false,
        }));
        setComments(commentsWithLikes);
      } catch (err) {
        console.error(err);
      }
    };

    fetchComments();
  }, [video]);

  // Add emoji to comment
  const addEmoji = (emoji) => {
    setNewComment((prev) => prev + emoji);
    setShowEmojis(false);
  };

  // Post new comment
  const handlePost = async () => {
    if (!newComment.trim()) return;
    try {
      const res = await axios.post(
        `http://localhost:5000/api/comments/${video.id}`,
        { text: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const commentWithLikes = {
        ...res.data,
        id: res.data._id,
        likes: Math.floor(Math.random() * 50),
        dislikes: Math.floor(Math.random() * 20),
        liked: false,
        disliked: false,
      };
      setComments([commentWithLikes, ...comments]);
      setNewComment("");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to post comment");
    }
  };

  // Like / Dislike
  const handleLike = (id) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          let { likes, dislikes, liked, disliked } = c;
          if (liked) likes -= 1;
          else {
            likes += 1;
            if (disliked) {
              dislikes -= 1;
              disliked = false;
            }
          }
          return { ...c, likes, dislikes, liked: !liked, disliked };
        }
        return c;
      })
    );
  };

  const handleDislike = (id) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          let { likes, dislikes, liked, disliked } = c;
          if (disliked) dislikes -= 1;
          else {
            dislikes += 1;
            if (liked) {
              likes -= 1;
              liked = false;
            }
          }
          return { ...c, likes, dislikes, liked, disliked: !disliked };
        }
        return c;
      })
    );
  };

  // Edit comment
  const handleEdit = (id, text) => {
    setEditingCommentId(id);
    setEditingText(text);
  };

  const handleUpdate = async (id) => {
    if (!editingText.trim()) return;
    try {
      const res = await axios.put(
        `http://localhost:5000/api/comments/${id}`,
        { text: editingText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments((prev) =>
        prev.map((c) => (c.id === id ? { ...c, text: res.data.text } : c))
      );
      setEditingCommentId(null);
      setEditingText("");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update comment");
    }
  };

  // Delete comment
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/comments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete comment");
    }
  };

  return (
    <div className="comments-section">
      <h3>{comments.length} Comments</h3>

      <div className="comment-box">
        <input
          type="text"
          placeholder="Add a public comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button onClick={handlePost}>Comment</button>
        <button
          type="button"
          onClick={() => setShowEmojis((prev) => !prev)}
          className="emoji-toggle"
        >
          🙂
        </button>

        {showEmojis && (
          <div className="emoji-picker">
            {emojis.map((emoji, i) => (
              <button id="emojiPickerId"
                key={i}
                type="button"
                onClick={() => addEmoji(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>

      {comments.map((c) => (
        <div key={c.id} className="comment-item">
          <img
            src={`https://i.pravatar.cc/40?u=${c.userId}`}
            alt="avatar"
            className="avatar"
          />
          <div className="comment-content">
            <div className="comment-header">
              <strong>{c.username}</strong>
              <span>{timeAgo(c.createdAt)}</span>
            </div>

            {editingCommentId === c.id ? (
              <>
                <input
                  type="text"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                />
                <button onClick={() => handleUpdate(c.id)}>Update</button>
                <button onClick={() => setEditingCommentId(null)}>Cancel</button>
              </>
            ) : (
              <p className="comment-text">{c.text}</p>
            )}

            <div className="comment-actions">
              <button
                className={c.liked ? "active" : ""}
                onClick={() => handleLike(c.id)}
              >
                <AiOutlineLike /> {c.likes}
              </button>
              <button
                className={c.disliked ? "active" : ""}
                onClick={() => handleDislike(c.id)}
              >
                <AiOutlineDislike /> {c.dislikes}
              </button>
              <button onClick={() => handleEdit(c.id, c.text)}>
                <FaEdit /> Edit
              </button>
              <button onClick={() => handleDelete(c.id)}>
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}