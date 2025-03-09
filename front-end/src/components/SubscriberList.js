import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Css/SubscriberList.css";

const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
const ITEMS_PER_PAGE = 10;

const SubscriberList = ({ updateSubscribers }) => {
  const [subscribers, setSubscribers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);

  useEffect(() => {
    fetchSubscribers(currentPage);
  }, [currentPage]);

  const fetchSubscribers = async (page) => {
    try {
      const response = await axios.get(`${API_URL}/subscribers`, {
        params: { page, limit: ITEMS_PER_PAGE },
      });

      setSubscribers(response.data.results || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching subscribers:", error);
      toast.error("Failed to fetch subscribers");
    }
  };

  const handleShowModal = (email) => {
    setSelectedEmail(email);
    setShowModal(true);
  };

  const handleRemove = async () => {
    try {
      await axios.delete(`${API_URL}/subscribers/${selectedEmail}`);
      toast.success("Subscriber removed successfully");
      fetchSubscribers(currentPage);
    } catch (error) {
      console.error(
        "Error removing subscriber:",
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.error || "Failed to remove subscriber");
    } finally {
      setShowModal(false);
    }
  };

  return (
    <div className="add-subscriber-wrapper">
      <div className="add-subscriber">
        <div className="add-subscriber-header">Subscribers</div>
        <div className="subscriber-content">
          {subscribers.length > 0 ? (
            <>
              <ul className="list-group">
                {subscribers.map((sub, index) => (
                  <li
                    key={index}
                    className="list-group-item d-flex justify-content-between align-items-center subscriber-item"
                  >
                    <span className="subscriber-email" title={sub.EmailAddress}>
                      {sub.EmailAddress}
                    </span>
                    <span className="subscriber-name">{sub.Name}</span>
                    <button
                      className="btn btn-sm delete-btn"
                      onClick={() => handleShowModal(sub.EmailAddress)}
                    >
                      <FontAwesomeIcon icon={faTrash} className="trash-icon" />
                    </button>
                  </li>
                ))}
              </ul>
              <div className="pagination-controls">
                <button
                  className="pagination-btn"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                  ‹
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    className={`pagination-btn ${
                      currentPage === i + 1 ? "pagination-number" : ""
                    }`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  className="pagination-btn"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                  ›
                </button>
              </div>
            </>
          ) : (
            <p className="text-center">No subscribers found.</p>
          )}
        </div>
      </div>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        className="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Subscriber</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to remove <strong>{selectedEmail}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button className="modal-delete-btn" onClick={handleRemove}>
            Delete
          </Button>
          <Button
            className="modal-cancel-btn"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SubscriberList;
