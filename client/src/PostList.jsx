import React, { useState } from "react"; 
import CommentCreate from "./CommentCreate";
import CommentList from "./CommentList";

const PostList = ({ posts }) => {
  const [commentRefreshCount, setCommentRefreshCount] = useState(0);

  const onCommentCreated = () => {
    setCommentRefreshCount((prev) => prev + 1);
  };

  const renderedPosts = Object.values(posts).map((post) => (
    <div
      key={post.id}
      style={{
        border: "1px solid #ccc",
        padding: "15px",
        marginBottom: "20px",
      }}
    >
      <div>
        <h3>{post.title}</h3>
        <hr />
        <CommentList postId={post.id} refreshKey={commentRefreshCount} />
        <CommentCreate postId={post.id} onCommentCreated={onCommentCreated} />
      </div>
    </div>
  ));

  return (
    <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "20px" }}>
      {renderedPosts}
    </div>
  );
};

export default PostList;
