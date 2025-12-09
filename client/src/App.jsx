import React, { useState, useEffect } from "react";
import PostCreate from "./PostCreate";
import PostList from "./PostList";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [posts, setPosts] = useState([]);


  const fetchPosts = async () => {
    try {
      const res = await fetch("http://blog.local/posts");
      const posts = await res.json();

      setPosts(posts);
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
