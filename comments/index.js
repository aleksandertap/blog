
const express = require("express");
const cors = require("cors");
const axios = require("axios")

const app = express();
const PORT = 5001;

const postComments = [];

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));


app.get("/posts/:id/comments", (req, res) => {
  try {
    const postId = req.params.id;
    
    const commentsForPost = postComments.filter(
      (comment) => comment.postId === postId
    );
    res.json({ comments: commentsForPost });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/posts/:id/comments", (req, res) => {
  try {
    const postId = req.params.id;
    const commentContent = req.body.comment;

    if (!commentContent || !postId) {
        return res.status(400).json({ message: "Post ID and comment content are required" });
    }
    
    const comment = {
      id: (postComments.length + 1).toString(), 
      postId,
      content: commentContent,
    };

    axios.post("http://localhost:5005/events", {
          type: "CommentCreated",
          data: comment,
        }).catch((error) => {
          console.log(error);
        })
    
    postComments.push(comment);
    res.status(201).json({ comment: comment, message: "Comment added successfully" });

  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/events", (req, res) => {
  res.json({});
});

app.listen(PORT, () => {
  console.log(`Comment Service is running on http://localhost:${PORT}`);
});