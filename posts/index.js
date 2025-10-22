const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = 5000;
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

const posts = [];

app.get("/posts", (req, res) => {
  res.json({ posts: posts });
});

app.post("/posts", (req, res) => {
  try {
    const title = req.body.title;
    const id = (posts.length + 1).toString();
    const post = {
      id: id,
      title: title,
    };
    posts.push(post);
 
    axios.post("http://localhost:5005/events", {
      type: "PostCreated",
      data: post,
    }).catch((error) => {
      console.log(error);
    })

    res.status(201).json({ post: post, message: "Post created successfully" });
  } catch (error) {
    console.error("Error creating post:", error);
  }
});

app.post("/events", (req, res) => {
  res.json({});
});

app.listen(PORT, () => {
  console.log(`Posts Service is running on http://localhost:${PORT}`);
});
