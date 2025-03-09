import React, { useState } from "react";
import SubscriberList from "./components/SubscriberList";
import AddSubscriber from "./components/AddSubscriber";
import { ToastContainer } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Css/App.css";
import Sidebar from "./components/Sidebar";

function App() {
  const [subscribers, setSubscribers] = useState([]);
  const [activeTab, setActiveTab] = useState("add");

  const updateSubscribers = (newSubscribers) => {
    setSubscribers(newSubscribers);
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div style={{ flexGrow: 1, padding: "20px" }}>
        {activeTab === "add" && (
          <AddSubscriber updateSubscribers={updateSubscribers} />
        )}
        {activeTab === "subscribers" && (
          <SubscriberList
            subscribers={subscribers}
            updateSubscribers={updateSubscribers}
          />
        )}
      </div>

      <ToastContainer />
    </div>
  );
}

export default App;
