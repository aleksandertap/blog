import React, { useState, useEffect } from "react";
import { use } from "react";
const CommentList = ({ comments }) => {

  const renderedComments = comments.map((comment) => (
    <li key={comment.id} style={{ fontSize: '0.9em', margin: '5px 0' }}>
      {comment.status === 'approved' ? comment.content : comment.status === 'pending' ? 'This comment is pending moderation' : 'This comment has been rejected'} 
    </li>
  ));


  return (
    <div style={{ paddingLeft: '15px' }}>
      <h6>{comments.length} Comments</h6>
      <ul>
        {renderedComments}
      </ul>
    </div>
  );
};

export default CommentList;