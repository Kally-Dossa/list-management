import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Css/AddSubscriber.css";

const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

const AddSubscriber = ({ updateSubscribers }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validateName = (name) => {
    const nameRegex = /^[A-Za-z]+(?:\s[A-Za-z]+)*$/;
    return nameRegex.test(name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      toast.error("Invalid email address");
      return;
    }

    if (!validateName(name)) {
      toast.error("Name must contain only Latin letters and spaces");
      return;
    }

    try {
      await axios.post(`${API_URL}/subscribers`, {
        email,
        name,
      });

      toast.success("Subscriber added successfully");
      updateSubscribers((prevSubscribers) => [
        ...prevSubscribers,
        { EmailAddress: email, Name: name },
      ]);
      setEmail("");
      setName("");
    } catch (error) {
      toast.error("Failed to add subscriber");
    }
  };

  return (
    <div className="add-subscriber-wrapper">
      <div className="add-subscriber">
        <div className="add-subscriber-header">Add Subscriber</div>
        <form onSubmit={handleSubmit} noValidate>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <button type="submit" className="add-btn">
            Add
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSubscriber;
