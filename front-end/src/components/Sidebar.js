import React, { useState, useEffect } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  ListItemIcon,
  Divider,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PeopleIcon from "@mui/icons-material/People";
import EmailIcon from "@mui/icons-material/Email";
import "../Css/Sidebar.css";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const [open, setOpen] = useState(window.innerWidth > 768);
  useEffect(() => {
    const handleResize = () => {
      setOpen(window.innerWidth > 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Drawer
      variant="permanent"
      className={`sidebar ${open ? "open" : "closed"}`}
    >
      <div className="sidebar-header">
        <ListItemIcon>
          <EmailIcon className="sidebar-icon" />
        </ListItemIcon>
        {open && <span className="sidebar-title">List Management</span>}
      </div>

      <Divider className="sidebar-divider" />

      <div className="sidebar-content">
        <List className="sidebar-list">
          <ListItem
            button
            className={activeTab === "add" ? "active" : ""}
            onClick={() => setActiveTab("add")}
          >
            <ListItemIcon>
              <PersonAddIcon className="sidebar-icon" />
            </ListItemIcon>
            {open && (
              <ListItemText primary="Add Subscriber" className="sidebar-text" />
            )}
          </ListItem>

          <ListItem
            button
            className={activeTab === "subscribers" ? "active" : ""}
            onClick={() => setActiveTab("subscribers")}
          >
            <ListItemIcon>
              <PeopleIcon className="sidebar-icon" />
            </ListItemIcon>
            {open && (
              <ListItemText primary="Subscribers" className="sidebar-text" />
            )}
          </ListItem>
        </List>
      </div>

      <div className="sidebar-toggle" style={{ marginTop: "auto" }}>
        <IconButton onClick={() => setOpen(!open)}>
          {open ? (
            <ChevronLeftIcon className="sidebar-icon" />
          ) : (
            <ChevronRightIcon className="sidebar-icon" />
          )}
        </IconButton>
      </div>
    </Drawer>
  );
};

export default Sidebar;
