import React, { useState, useEffect } from "react";
import {
  AppBar, Toolbar, Button, Menu, MenuItem, Drawer, List, ListItemIcon, ListItemText,
  IconButton, Box, Grid, Paper, TextField, Typography, Card, CardContent, Checkbox, FormControlLabel
} from "@mui/material";
import {
  Dashboard, ListAlt, People, CloudUpload, Add, Delete, Close, DeleteForever, Brightness4,
  Brightness7, Menu as MenuIcon
} from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";
// import { addColumn, renameColumn, finalizeColumnTitle, handleColumnDragStart, addCard, removeCard, handleCardInputChange, handleCardInputKeyPress, handleCardDragStart, handleDrop, handleTrashDrop, handleCheckboxChange } from "./Components/Functions/cardColumnFunctions";
import { createCustomTheme } from "./Components/Functions/themeFunctions";
import { handleMenu, handleClose, toggleDrawer } from "./Components/Functions/eventHandlerFunctions";
import { navigateHome, handleLogout } from "./Components/Functions/navigationFunctions";

const Workspace = () => {
  const { id } = useParams(); // Get the id from the route parameters
  // Initialize darkMode state from local storage, or default to true if not set
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : true; // Initialize from local storage
  });
  // Initialize columns state from local storage, or default to an empty array if not set
  const [columns, setColumns] = useState(() => {
    const savedColumns = localStorage.getItem("columns");
    return savedColumns ? JSON.parse(savedColumns) : []; // Initialize from local storage
  });
  const [newMember, setNewMember] = useState("");
  const [members, setMembers] = useState(["Alsim", "Bobby", "Charlie"]);
  const [draggingColumn, setDraggingColumn] = useState(null); // For drag and drop
  const [draggingCard, setDraggingCard] = useState(null); // For drag and drop
  const [anchorEl, setAnchorEl] = useState(null); // For account menu
  const [user, setUser] = useState({ // User data
    userEmail: "user@example.com",
    userId: "12345",
    userOauth_id: "oauth12345",
  });
  const [drawerOpen, setDrawerOpen] = useState(true); // For drawer visibility or list
  const navigate = useNavigate(); // Navigation hook
  const location = useLocation();// Location hook

  const theme = createCustomTheme(darkMode);

  // Use useEffect to update local storage whenever darkMode changes
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode)); // Save mode to local storage
  }, [darkMode]);

  // Use useEffect to update local storage whenever columns change
  useEffect(() => {
    localStorage.setItem("columns", JSON.stringify(columns)); // Save columns to local storage
  }, [columns]);

  useEffect(() => { // Fetch user data 
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get("token");

    if (token) {
      localStorage.setItem("token", token);
    }

    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      console.error("No token found, redirecting...");
      navigate("/");
      return;
    }

    axios // fetch user data
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/data`, { 
        withCredentials: true,
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((response) => {
        console.log("API Response:", response.data);
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        navigate("/");
      });
  }, [navigate, location.search]);

  const toggleDarkMode = () => { // Toggle dark mode
    setDarkMode(!darkMode);
  };
  const showAddColumnPopup = (columns, setColumns) => { // Add a new column
    setColumns([
      ...columns,
      { id: Date.now(), title: "", isEditing: true, cards: [], newCardText: "", isAddingCard: false },
    ]);
  };

  return (
    <ThemeProvider theme={theme}>
      <div>
        {/* Global style to hide overflow */}
        <style>
          {`
            body, html {
              overflow: hidden;
              margin: 0;
            }
          `}
        </style>

        <Box // Main container
          sx={{
            display: "flex",
            position: "relative",
            backgroundImage: darkMode ? 'url("/stary.jpg")' : 'url("/cloud.jpg")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: "100vh",
            width: "100vw", // Ensure full width
            overflow: 'hidden', // Add this line to remove the scrollbar from the right side
          }}
        >
          <div style={{ 
                    position: "absolute", 
                    top: 0, 
                    width: "100%", 
                    display: "flex", 
                    alignItems: "center", 
                    padding: "10px 20px",
                    backgroundColor: "transparent",
                    zIndex: 1301
                  }}>
                    <IconButton
                      edge="start"
                      color="inherit"
                      aria-label="menu"
                      onClick={() => toggleDrawer(setDrawerOpen, drawerOpen)}
                      sx={{ mr: 2 , color: "white"}}
                    >
                      <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                      <img src="/hahaha.png" alt="Sitemark" />
                    </Typography>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Button
                        variant="outlined"
                        onClick={() => navigate("/workspace")} // Use the navigate function
                        sx={{
                          color: "black",
                          textTransform: "none",
                          backgroundColor: "#30A8DB",
                          boxShadow: 3,
                          mr: 2,
                        }}
                      >
                        Home
                      </Button>
                      {user && (
                        <div>
                          <Button
                            variant="outlined"
                            onClick={(e) => handleMenu(e, setAnchorEl)}
                            sx={{
                              color: "black",
                              textTransform: "none",
                              backgroundColor: "#30A8DB",
                              boxShadow: 3,
                              marginRight: "40px"
                            }}
                          >
                            Account
                          </Button>
                          <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                              vertical: "bottom",
                              horizontal: "right",
                            }}
                            keepMounted
                            transformOrigin={{
                              vertical: "top",
                              horizontal: "right",
                            }}
                            open={Boolean(anchorEl)}
                            onClose={() => handleClose(setAnchorEl)}
                          >
                            <MenuItem disabled>{`Email: ${user.userEmail}`}</MenuItem>
                            <MenuItem disabled>{`ID: ${user.userId}`}</MenuItem>
                            <MenuItem disabled>{`OAuth ID: ${user.userOauth_id}`}</MenuItem>
                            <MenuItem onClick={() => handleLogout(navigate)}>Logout</MenuItem>
                          </Menu>
                        </div>
                      )}
                    </div>
                  </div>
          <Drawer
            variant="persistent"
            anchor="left"
            open={drawerOpen}
            sx={{
              width: 240,
              flexShrink: 0,
              "& .MuiDrawer-paper": {
                width: 240,
                boxSizing: "border-box",
              },
            }}
          >
            
            <Box sx={{ display: "flex", alignItems: "center", pt: 15 }}>
              <IconButton onClick={toggleDarkMode} color="inherit">
                {darkMode ? <Brightness4 /> : <Brightness7 />}
              </IconButton>
              <Typography variant="h6" sx={{ marginLeft: 1 }}>
                {darkMode ? "Dark Mode" : "Light Mode"}
              </Typography>
            </Box>
            <List>
              {/* Add any additional navigation items here */}
            </List>
          </Drawer>
          
          {/* COLUMN DITO MICHAEL YUNG ADD COLUMN NA LUMILIPAD */}
          <Box 
            sx={{
              flexGrow: 1,
              padding: 3,
              marginLeft: drawerOpen ? "0px" : "0", /*column*/
              marginTop: "83px",
              transition: "margin-left 0.3s",
            }}
          >
            
            <Button variant="contained" startIcon={<Add />} onClick={() => showAddColumnPopup (columns, setColumns)} sx={{ borderRadius: "24px" }}>
              Add Column
            </Button>
            <Grid container spacing={2} sx={{ marginTop: 2 }}>
              {columns.map((column) => (
                <Grid
                  item
                  key={column.id}
                  xs={12}
                  sm={6}
                  md={4}
                  onDrop={(e) => handleDrop(e, column.id, draggingCard, columns, setColumns, setDraggingCard)}
                  onDragOver={(e) => e.preventDefault()}
                  draggable
                  onDragStart={(e) => handleColumnDragStart(e, column.id, setDraggingColumn)}
                >
                  <Paper
                    sx={{
                      padding: 2,
                      transition: "transform 0.3s",
                      "&:hover": { transform: "scale(1.02)" },
                      borderRadius: "24px", // Rounded corners for paper
                    }}
                  >
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      {column.isEditing ? (
                        <TextField
                          fullWidth
                          placeholder="Enter column name"
                          value={column.title}
                          onChange={(e) => renameColumn(columns, setColumns, column.id, e.target.value)}
                          onBlur={() => finalizeColumnTitle(columns, setColumns, column.id)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              finalizeColumnTitle(columns, setColumns, column.id);
                              e.preventDefault();
                            }
                          }}
                          autoFocus
                          sx={{ borderRadius: "24px" }} // Rounded corners for text field
                        />
                      ) : (
                        <Typography
                          variant="h6"
                          onClick={() =>
                            setColumns(
                              columns.map((col) =>
                                col.id === column.id ? { ...col, isEditing: true } : col
                              )
                            )
                          }
                        >
                          {column.title || "Untitled Column"}
                        </Typography>
                      )}
                      <IconButton onClick={() => setColumns(columns.filter((col) => col.id !== column.id))} sx={{ borderRadius: "24px" }}>
                        <Close />
                      </IconButton>
                    </Box>
                    <Box sx={{ marginTop: 2 }}>
                      {column.isAddingCard && (
                        <TextField
                          fullWidth
                          placeholder="Enter card text and press Enter"
                          value={column.newCardText}
                          onChange={(e) => handleCardInputChange(columns, setColumns, column.id, e.target.value)}
                          onKeyPress={(e) => handleCardInputKeyPress(e, column.id, columns, setColumns)}
                          onBlur={() => addCard(columns, setColumns, column.id)}
                          autoFocus
                          sx={{ marginBottom: 1, borderRadius: "24px" }} // Rounded corners for text field
                        />
                      )}
                      {column.cards.map((card) => (
                        <Card
                          key={card.id}
                          sx={{
                            marginBottom: 1,
                            backgroundColor: "rgba(240, 232, 232, 0.1)", // Making card transparent
                            transition: "transform 0.3s",
                            "&:hover": { transform: "scale(1.02)" },
                            borderRadius: "24px", // Rounded corners for card
                          }}
                          draggable
                          onDragStart={(e) => handleCardDragStart(e, card.id, column.id, setDraggingCard)}
                        >
                          <CardContent
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              borderRadius: "24px", // Rounded corners for card content
                            }}
                          >
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={card.checked}
                                  onChange={(e) => handleCheckboxChange(column.id, card.id, e.target.checked, setColumns)}
                                  sx={{ borderRadius: "50%" }} // Making checkbox round
                                />
                              }
                              label={<Typography>{card.text}</Typography>}
                            />
                            <IconButton edge="end" onClick={() => removeCard(columns, setColumns, column.id, card.id)}>
                              <Delete />
                            </IconButton>
                          </CardContent>
                        </Card>
                      ))}
                      <Button
                        variant="text"
                        startIcon={<Add />}
                        onClick={() => setColumns(
                          columns.map((col) =>
                            col.id === column.id ? { ...col, newCardText: "", isAddingCard: true } : col
                          )
                        )}
                        sx={{ borderRadius: "24px", marginTop: 1 }}
                      >
                        Add a card
                      </Button>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
            <Box
              sx={{
                position: "fixed",
                right: 16,
                bottom: 16,
                backgroundColor: "red",
                color: "#fff",
                borderRadius: "50%",
                width: 56,
                height: 56,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              onDrop={(e) => handleTrashDrop(e, draggingCard, columns, setColumns, setDraggingCard)}
              onDragOver={(e) => e.preventDefault()}
            >
              <DeleteForever fontSize="large" />
            </Box>
          </Box>
        </Box>
      </div>
    </ThemeProvider>
  );
};

export default Workspace;