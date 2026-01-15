import React, { useState } from 'react';

const PostCreate = ({ onPostCreated }) => { 
    const [title, setTitle] = useState("");

    const createPost = async (e) => {
        e.preventDefault();

        if (!title.trim()) return;

        try {
            const response = await fetch("https://blog.local/posts/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title }),
            });
            
            if (response.ok) {
                setTitle("");
                
                if (onPostCreated) {
                    onPostCreated();
                }
            } else {
                console.error("Failed to create post:", response.status);
            }
        } catch (error) {
            console.error("Network error while creating post:", error);
        }
    };

    return (
        <div>
            <h1>Add post</h1>
            <form onSubmit={createPost} className='d-flex flex-lg-column'>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Post title"
                />
                <button type="submit" className="btn btn-primary">Add Post</button>
            </form>
        </div>
    );
};

export default PostCreate;