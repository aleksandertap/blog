import React, { useState, useEffect } from "react";

const CommentList = ({ postId, refreshKey }) => {
  const [comments, setComments] = useState([]);

  const fetchComments = async () => {
    try {
      const response = await fetch(
        `http://localhost:5001/comments/${postId}`
      );
      const data = await response.json();

      setComments(data.comments || []);
    } catch (error) {
      console.error(`Error fetching comments for post ${postId}:`, error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId, refreshKey]); 

  const renderedComments = comments.map((comment) => (
    <li key={comment.id} style={{ fontSize: '0.9em', margin: '5px 0' }}>
      {comment.comment} 
    </li>
  ));


  return (
    <div style={{ paddingLeft: '15px' }}>
      <h6>Comments</h6>
      {renderedComments}
    </div>
  );
};

export default CommentList;