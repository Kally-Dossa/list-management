require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const API_KEY = process.env.CM_API_KEY;
const LIST_ID = process.env.CM_LIST_ID;
const BASE_URL = "https://api.createsend.com/api/v3.2";
const auth = Buffer.from(`${API_KEY}:x`).toString("base64");

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.get("/subscribers", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = Math.max(10, parseInt(req.query.limit) || 10);

  try {
    const response = await axios.get(
      `${BASE_URL}/lists/${LIST_ID}/active.json?page=${page}&pagesize=${limit}`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({
      results: response.data.Results || [],
      totalPages: Math.ceil(response.data.TotalNumberOfRecords / limit),
      totalSubscribers: response.data.TotalNumberOfRecords,
      currentPage: page,
    });
  } catch (error) {
    console.error(
      "API Error (GET Subscribers):",
      error.response?.data || error.message
    );
    res
      .status(error.response?.status || 500)
      .json({ error: "Failed to fetch subscribers" });
  }
});

app.post("/subscribers", async (req, res) => {
  const { email, name } = req.body;

  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ error: "Invalid or missing email" });
  }

  try {
    const response = await axios.post(
      `${BASE_URL}/subscribers/${LIST_ID}.json`,
      {
        EmailAddress: email,
        Name: name || "",
        Resubscribe: true,
        ConsentToTrack: "Yes",
      },
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(`Subscriber added: ${email}`);
    res.json({ message: "Subscriber added successfully", data: response.data });
  } catch (error) {
    console.error(
      "API Error (POST Subscriber):",
      error.response?.data || error.message
    );
    res
      .status(error.response?.status || 500)
      .json({ error: "Failed to add subscriber" });
  }
});

app.delete("/subscribers/:email", async (req, res) => {
  const email = req.params.email;

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  try {
    await axios.post(
      `${BASE_URL}/subscribers/${LIST_ID}/unsubscribe.json`,
      { EmailAddress: email },
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(`Subscriber removed: ${email}`);
    res.json({ message: "Subscriber removed successfully" });
  } catch (error) {
    console.error(
      "API Error (DELETE Subscriber):",
      error.response?.data || error.message
    );
    res
      .status(error.response?.status || 500)
      .json({ error: "Failed to remove subscriber" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
