const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

const posts = []

app.get("/posts", (req, res) => {
  res.json({ posts: posts });
});

app.post("/posts", (req, res) => {
  try {
    const title = req.body.title;
    const post = {
      id: (posts.length + 1).toString(),
      title: title,
    };
    posts.push(post);
    res.status(201).json({ post: post, message: "Post created successfully" });
  } catch (error) {
    console.error("Error creating post:", error);
  }
});

app.listen(PORT, () => {
  console.log(`Posts Service is running on http://localhost:${PORT}`);
});