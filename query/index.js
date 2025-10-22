const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5002;

app.use(express.json());
app.use(cors());

const posts = {};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events", (req, res) => {
  if (req.body.type === "PostCreated") {
    const { id, title } = req.body.data;
    posts[id] = { id, title, comments: [] };
  }

  if (req.body.type === "CommentCreated") {
    const { id, content, postId } = req.body.data;
    const post = posts[postId];
    post.comments.push({ id, content });
  }

  console.log(posts);
  res.json({});
});

app.listen(PORT, () => {
  console.log(`Query Service is running on http://localhost:${PORT}`);
});
