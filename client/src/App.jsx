import React, { useState, useEffect } from "react";
import PostCreate from "./PostCreate";
import PostList from "./PostList";

function App() {
  const [posts, setPosts] = useState({});

  const fetchPosts = async () => {
    try {
      const res = await fetch("http://localhost:5000/posts");
      const data = await res.json();
      const postsArray = data.posts || [];

      const postsObject = postsArray.reduce((acc, post) => {
        acc[post.id] = post;
        return acc;
      }, {});

      setPosts(postsObject);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="container" style={{ padding: "20px" }}>
      <PostCreate onPostCreated={fetchPosts} />
      <hr style={{ margin: "30px 0" }} />
      <h1>Posts</h1>
      <PostList posts={posts} />
    </div>
  );
}

export default App;
