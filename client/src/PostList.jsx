import React, { useState } from "react"; 
import CommentCreate from "./CommentCreate";
import CommentList from "./CommentList";

const PostList = ({ posts }) => {
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
        <CommentList comments={post.comments}  />
        <CommentCreate postId={post.id}  />
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
