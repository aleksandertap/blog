import React, { useState } from "react";

const CommentCreate = ({ postId, onCommentCreated }) => {
  const [content, setContent] = useState("");

  const addComment = async (e) => {
    e.preventDefault();

    if (!content.trim()) return;

    const response = await fetch(
      `http://localhost:5001/posts/${postId}/comments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment: content }),
      }
    );

    if (response.ok) {
      setContent("");

      if (onCommentCreated) {
        onCommentCreated();
      }
    } else {
      console.error("Failed to create comment", response.status);
    }
  };

  return (
    <div>
      <form onSubmit={addComment}>
        <div>
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Add a comment"
          />
          <button type="submit" className="btn btn-primary">Add Comment</button>
        </div>
      </form>
    </div>
  );
};

export default CommentCreate;
