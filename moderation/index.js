const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const PORT = 5003;
app.use(bodyParser.json());

app.post('/events', async (req, res) => {
  const { type, data } = req.body;

  if (type === 'CommentCreated') {
    const { id, postId, content } = data;
    const status = data.content.includes('orange') ? 'rejected' : 'approved';
    

    await axios.post('http://event-bus-service:5005/events', {
        type: 'CommentModerated',
        data: {
            id,
            postId,
            content,
            status
        }
    });

    res.send({});
  }
});

app.listen(PORT, () => {
  console.log(`Moderation Service is running on http://localhost:${PORT}`);
});

