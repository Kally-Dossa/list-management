require("dotenv").config();
const express = require("express");
const axios = require("axios");
const router = express.Router();

const API_KEY = process.env.CM_API_KEY;
const LIST_ID = process.env.CM_LIST_ID;
const BASE_URL = "https://api.createsend.com/api/v3.2";

const auth = Buffer.from(`${API_KEY}:x`).toString("base64");

router.get("/", async (req, res) => {
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
      "API Error:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({
      error: error.response ? error.response.data : "Internal Server Error",
    });
  }
});

router.post("/", async (req, res) => {
  const { email, name } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
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

    console.log("Campaign Monitor Response:", response.data);
    res.json({ message: "Subscriber added successfully" });
  } catch (error) {
    console.error(
      "API Error:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({
      error: error.response ? error.response.data : "Internal Server Error",
    });
  }
});

router.delete("/:email", async (req, res) => {
  const email = req.params.email;
  try {
    await axios.post(
      `${BASE_URL}/subscribers/${LIST_ID}/unsubscribe.json`,
      {
        EmailAddress: email,
      },
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
      }
    );
    res.json({ message: "Subscriber removed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
