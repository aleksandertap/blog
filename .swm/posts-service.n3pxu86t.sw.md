---
title: Posts Service
---
# What is This Service?

The **Posts Service** is a simple backend API that lets users create and view blog posts. It's part of a bigger microservices project where different services talk to each other through events.

**What you'll learn:**

- Building REST APIs with Express.js
- Event-driven architecture basics
- How microservices communicate
- Working with Docker and Kubernetes

**Tech Stack:**

- Node.js + Express (backend framework)
- Axios (for HTTP requests)
- In-memory storage (just an array for now)

---

# 1\. Project Setup and Dependencies

For the Posts service to run, you need to install the following dependencies in your project's root folder <SwmPath>[posts/](/posts/)</SwmPath>

- <SwmToken path="/posts/index.js" pos="1:9:9" line-data="const express = require(&quot;express&quot;);">`express`</SwmToken> - The core web framework.
- <SwmToken path="/posts/index.js" pos="2:2:2" line-data="const cors = require(&quot;cors&quot;);">`cors`</SwmToken> - Enables Cross-Origin Resource Sharing.
- <SwmToken path="/posts/index.js" pos="3:2:2" line-data="const axios = require(&quot;axios&quot;);">`axios`</SwmToken> - HTTP client used to send events to the Event Bus.

If you are not in the posts folder, go to the posts folder

> cd posts

Run installation command

> npm i&nbsp;

# 2\. Starting service

o start the service using nodemon (for automatic restarts during development), use the npm start script defined in your <SwmPath>[posts/package.json](/posts/package.json)</SwmPath>.

If you are not in the posts folder in you terminal, go to the posts folder

> cd posts

Run command

> npm start

You should now see in the terminal

> \\> posts@1.0.0 start
>
> \\> nodemon index.js
>
> \[nodemon\] 3.1.10
>
> \[nodemon\] to restart at any time, enter `rs`
>
> \[nodemon\] watching path(s): *.*
>
> \[nodemon\] watching extensions: js,mjs,cjs,json
>
> \[nodemon\] starting `node index.js`
>
> Posts Service is running on <http://localhost:5000>

# 3\. How Does It Work?&nbsp;

**Simple explanation:** When someone creates a post, two things happen:

1. The post gets saved in memory (in an array)
2. An event is sent to the Event Bus to notify other services

**Why events?** This lets other services (like Comments or Query) know about new posts without directly calling them. It's like posting on a group chat - everyone interested can see it!

```mermaid
graph TD
    A[Client Request] -->|POST /posts/create| B(Posts Service:5000)
    B -->|1. Save post| C[posts array]
    B -->|2. Tell everyone!| D[Event Bus:5005]
    D -->|Event: PostCreated| E[Other Services]
```

**Important to know:**

- Posts are stored in an array (not a real database yet)
- When the service restarts, all posts are lost
- Each post gets an ID and has a title

# 4\. API Endpoints

This service provides two main API functionalities: creating a new post and retrieving all posts. The data is currently stored in the in-memory <SwmToken path="/posts/index.js" pos="11:2:2" line-data="const posts = [];">`posts`</SwmToken> array.

<SwmSnippet path="/posts/index.js" line="11">

---

Array for holding post objects

```javascript
const posts = [];
```

---

</SwmSnippet>

## 4.1 POST /posts: Making a Post

<SwmSnippet path="/posts/index.js" line="17">

---

This endpoint handles both the creation of the post and the critical step of emitting an event to <SwmPath>[event-bus/index.js](/event-bus/index.js)</SwmPath>.

```javascript
app.post("/posts/create", (req, res) => {
  try {
    const title = req.body.title;
    const id = (posts.length + 1).toString();
    const post = {
      id: id,
      title: title,
    };
    posts.push(post);
 
    axios.post("http://event-bus-service:5005/events", {
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
```

---

</SwmSnippet>

### 4.1.1Request Example

Url: <localhost:5000/posts>

Method: POST

Request body (raw)

```json
{
    "title": "Making first post"
}
```

Response: 201 Created

## 4.2 GET /posts: Getting all Posts

<SwmSnippet path="/posts/index.js" line="13">

---

This endpoint simply returns the current contents of the in-memory array.

```javascript
app.get("/posts", (req, res) => {
  res.json({ posts: posts });
});
```

---

</SwmSnippet>

### 4.2.1 Request Example

Url <localhost:5000/posts>

Method: GET

Response

```json
{"1":{"id":"1","title":"firstpost","comments":[{"id":"1","content":"comment","status":"approved"}]}}
```

# 6\. What's a Post Object? 📦

A post is just a JavaScript object with two fields:

```javascript
{
  id: "1",           // Auto-generated number (as string)
  title: "My Post"   // Whatever the user sends
}
```

**Note:** The ID just counts up (1, 2, 3...) but resets when you restart the service.

---

# 7\. Common Issues & Solutions&nbsp;

## "Posts disappear when I restart!"

**This is normal!** The posts are only in memory (RAM), not saved to a database. When the service stops, the array is cleared.

## "Can't connect to Event Bus"

Make sure the Event Bus service is running. In Kubernetes, check with:

```bash
kubectl get pods
```

## "Port 5000 already in use"

Another service is using that port. Either:

- Stop the other service
- Change the PORT in `index.js`

---

# 8\. Testing Your Service 🧪

## Using cURL (Terminal)

**Create a post:**

```bash
curl -X POST http://localhost:5000/posts/create \
  -H "Content-Type: application/json" \
  -d '{"title": "Hello World"}'
```

**Get all posts:**

```bash
curl http://localhost:5000/posts
```

## Using Postman or Thunder Client

1. **Create POST** → `http://localhost:5000/posts/create`

2. **Body** → Raw → JSON:

   ```json
   {"title": "My awesome post"}
   ```

3. **Send!**

4. &nbsp;

   ```json
   {
       "post": {
           "id": "3",
           "title": "My awesome posts"
       },
       "message": "Post created successfully"
   }
   ```

---

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBYmxvZyUzQSUzQWFsZWtzYW5kZXJ0YXA=" repo-name="blog"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>
