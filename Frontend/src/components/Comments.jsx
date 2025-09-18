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
  const [emojiTarget, setEmojiTarget] = useState(null);
  const token = sessionStorage.getItem("token");


  // Fetched comments
  useEffect(() => {
    if (!video || !video.id) return;

    const fetchComments = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/comments/${video.id}`
        );

        // Map backend comments to state with likes/dislikes counts
        const commentsFromServer = res.data.map((c) => ({
          ...c,
          id: c._id,
          likes: c.likes ? c.likes.length : 0,
          dislikes: c.dislikes ? c.dislikes.length : 0,
          liked: c.likes ? c.likes.includes(token) : false,
          disliked: c.dislikes ? c.dislikes.includes(token) : false,
        }));

        setComments(commentsFromServer);
      } catch (err) {
        console.error(err);
      }
    };

    fetchComments();
  }, [video, token]);

  const addEmoji = (emoji) => {
    if (emojiTarget === "new") {
      setNewComment((prev) => prev + emoji);
    } else if (emojiTarget === "edit") {
      setEditingText((prev) => prev + emoji);
    }
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

      // res.data is a single object, not an array
      const comment = {
        ...res.data,
        id: res.data._id,
        likes: res.data.likes ? res.data.likes.length : 0,
        dislikes: res.data.dislikes ? res.data.dislikes.length : 0,
        liked: res.data.likes ? res.data.likes.includes(token) : false,
        disliked: res.data.dislikes ? res.data.dislikes.includes(token) : false,
      };

      setComments([comment, ...comments]);
      setNewComment("");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to post comment");
    }
  };

  // // Like / Dislike
  // const handleLike = (id) => {
  //   setComments((prev) =>
  //     prev.map((c) => {
  //       if (c.id === id) {
  //         let { likes, dislikes, liked, disliked } = c;
  //         if (liked) likes -= 1;
  //         else {
  //           likes += 1;
  //           if (disliked) {
  //             dislikes -= 1;
  //             disliked = false;
  //           }
  //         }
  //         return { ...c, likes, dislikes, liked: !liked, disliked };
  //       }
  //       return c;
  //     })
  //   );
  // };

  // const handleDislike = (id) => {
  //   setComments((prev) =>
  //     prev.map((c) => {
  //       if (c.id === id) {
  //         let { likes, dislikes, liked, disliked } = c;
  //         if (disliked) dislikes -= 1;
  //         else {
  //           dislikes += 1;
  //           if (liked) {
  //             likes -= 1;
  //             liked = false;
  //           }
  //         }
  //         return { ...c, likes, dislikes, liked, disliked: !disliked };
  //       }
  //       return c;
  //     })
  //   );
  // };

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
    const confirmed = window.confirm("Are you sure you want to delete this comment?");
    if (!confirmed) return;
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

  // Like comment
  const handleLike = async (id) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/comments/${id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setComments((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
              ...c,
              likes: res.data.likes.length,
              dislikes: res.data.dislikes.length,
              liked: res.data.likes.includes(token),
              disliked: res.data.dislikes.includes(token),
            }
            : c
        )
      );
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to like comment");
    }
  };

  // Dislike comment
  const handleDislike = async (id) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/comments/${id}/dislike`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setComments((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
              ...c,
              likes: res.data.likes.length,
              dislikes: res.data.dislikes.length,
              liked: res.data.likes.includes(token),
              disliked: res.data.dislikes.includes(token),
            }
            : c
        )
      );
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to dislike comment");
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
          onClick={() => {
            setEmojiTarget("new");
            setShowEmojis((prev) => !prev);
          }}
          className="emoji-toggle"
        >
          🙂
        </button>

        {showEmojis && emojiTarget === "new" && (
          <div className="emoji-picker">
            {emojis.map((emoji, i) => (
              <button
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
                <div className="edit-actions">
                  <button onClick={() => handleUpdate(c.id)}>Update</button>
                  <button onClick={() => setEditingCommentId(null)}>Cancel</button>
                  <button
                    type="button"
                    onClick={() => {
                      setEmojiTarget("edit");
                      setShowEmojis((prev) => (editingCommentId === c.id ? !prev : true));
                    }}
                    className="emoji-toggle"
                  >
                    🙂
                  </button>
                </div>

                {showEmojis && emojiTarget === "edit" && editingCommentId === c.id && (
                  <div className="emoji-picker">
                    {emojis.map((emoji, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => addEmoji(emoji)}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
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