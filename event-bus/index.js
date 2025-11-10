const express = require("express");
const axios = require("axios");
const app = express();
const PORT = 5005;
app.use(express.json());

app.post("/events", (req, res) => {
  try {
    const event = req.body;
    console.log("Recieved event:", event.type);

    axios.post(`http://posts:5000/events`, event).catch((error) => {
      console.log(error);
    });

    axios.post(`http://comments:5001/events`, event).catch((error) => {
      console.log(error);
    });

    axios.post(`http://query:5002/events`, event).catch((error) => {
      console.log(error);
    });

    axios.post(`http://moderation:5003/events`, event).catch((error) => {
      console.log(error);
    });

    res.json({ status: "OK" });
  } catch (error) {
    console.error(error);
  }
});

app.listen(PORT, () => {
  console.log(`Event-Bus Service is running on http://localhost:${PORT}`);
});
