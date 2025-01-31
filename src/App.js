import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useParams, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Drawer, List, ListItem, Card, CardContent, TextField, Button, Table, TableHead, TableRow, TableCell, TableBody, Typography, FormControl, InputLabel, Select, MenuItem, IconButton, ListItemText, Divider } from "@mui/material";
import dayjs from 'dayjs';
import { Menu as MenuIcon } from '@mui/icons-material';

const API_URL = process.env.REACT_APP_API_URL;

// const Menu = () => (
//   <Drawer variant="permanent" open>
//     <List>
//       {["Add Task", "View Tasks", "View Pending", "View Completed", "Update Task", "Delete Task"].map((text, index) => (
//         <ListItem button key={index}>
//           <Link to={`/${text.replace(/ /g, "").toLowerCase()}`}>{text}</Link>
//         </ListItem>
//       ))}
//     </List>
//   </Drawer>
// );


const AddTask = () => {

  const [task, setTask] = useState({
    description: "",
    deadline: dayjs().format('YYYY-MM-DD'), // Initialize with today's date in 'YYYY-MM-DD' format
    status: "Pending",
    priority: "Medium"
  });

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const formattedDeadline = dayjs(task.deadline).format('YYYY-MM-DD HH:mm:ss'); // Format as per API requirement

    const updatedTask = {
      ...task,
      deadline: formattedDeadline,
    };
    try {
      await fetch("http://127.0.0.1:5000/task/add_task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTask),
      });
      alert("Task Added Successfully");
    } catch (error) {
      console.error("Error adding task:", error);
      alert("Failed to add task.");
    }
  };

  return (
    <Card sx={{ maxWidth: 400, margin: "auto", padding: 2, mt: 4 }}>
      <CardContent>
        <Typography variant="h6">Add Task</Typography>
        <TextField
          fullWidth
          label="Description"
          name="description"
          value={task.description}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          type="date"
          name="deadline"
          value={task.deadline}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Status</InputLabel>
          <Select
            name="status"
            value={task.status}
            onChange={handleChange}
            label="Status"
          >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" onClick={handleSubmit}>
          Submit
        </Button>
      </CardContent>
    </Card>
  );
};


const UpdateTask = () => {
  const { task_id } = useParams(); // Extract task_id from URL
  const location = useLocation();
  const [task, setTask] = useState(location.state?.task || null); // Use passed task if available
  const [loading, setLoading] = useState(!task);
  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const formattedDeadline = dayjs(task.deadline).format("YYYY-MM-DD HH:mm:ss");

    const updatedTask = {
      ...task,
      deadline: formattedDeadline,
    };

    try {
      await fetch("http://127.0.0.1:5000/update/updatetask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTask),
      });
      alert("Task Updated Successfully");
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Failed to update task.");
    }
  };

  useEffect(() => {
    if (!task) {
      // Fetch all tasks and filter the required one
      const fetchTasks = async () => {
        try {
          const response = await fetch("http://127.0.0.1:5000/viewtask/gettask");
          const data = await response.json();

          // Find the specific task by task_id
          const selectedTask = data.find((t) => t.task_id.toString() === task_id);

          if (selectedTask) {
            setTask(selectedTask);
          } else {
            console.error("Task not found");
          }

          setLoading(false);
        } catch (error) {
          console.error("Error fetching tasks:", error);
        }
      };

      fetchTasks();
    }
  }, [task, task_id]);

  if (loading) return <p>Loading task details...</p>;
  if (!task) return <p>Task not found!</p>;

  return (
    <Card sx={{ maxWidth: 400, margin: "auto", padding: 2, mt: 4 }}>
      <CardContent>
        <Typography variant="h6">Update Task</Typography>
        <TextField
          fullWidth
          label="Description"
          name="description"
          value={task.description}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          type="date"
          name="deadline"
          value={task.deadline}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Status</InputLabel>
          <Select
            name="status"
            value={task.status}
            onChange={handleChange}
            label="Status"
          >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" onClick={handleSubmit}>
          Update
        </Button>
      </CardContent>
    </Card>
  );
};


const ViewTasks = () => {
  const [tasks, setTasks] = useState([]);

  // Fetch tasks from the API
  useEffect(() => {
    fetch('http://127.0.0.1:5000/viewtask/gettask')
      .then((res) => res.json())
      .then((data) => setTasks(data));
  }, []);

  // Function to handle task deletion
  const handleDelete = (taskId) => {
    try {
      fetch(`http://127.0.0.1:5000/deletetask/deletetask/${taskId}`, {
        method: 'DELETE',
      })
      alert("Task Deleted Successfully");
    } catch (error) {
      console.error("Error delete task:", error);
      alert("Failed to delete task.");
    }
  };

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>ID</TableCell>
          <TableCell>Description</TableCell>
          <TableCell>Deadline</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {tasks.map((task) => (
          <TableRow key={task.task_id}>
            <TableCell>{task.task_id}</TableCell>
            <TableCell>{task.description}</TableCell>
            <TableCell>{task.deadline}</TableCell>
            <TableCell>{task.status}</TableCell>
            <TableCell>
              <Button
                component={Link}
                to={`/updatetask/${task.task_id}`} // Link to update page
                variant="outlined"
                color="primary"
              >
                Update
              </Button>
              <Button
                onClick={() => handleDelete(task.task_id)} // Delete task
                variant="outlined"
                color="secondary"
                style={{ marginLeft: '10px' }}
              >
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const ViewPendingTasks = () => {
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    fetch('http://127.0.0.1:5000/pendingtask/pendingtask')
      .then((res) => res.json())
      .then((data) => setTasks(data));
  }, []);

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>ID</TableCell>
          <TableCell>Description</TableCell>
          <TableCell>Deadline</TableCell>
          <TableCell>Status</TableCell>
          {/* <TableCell>Priority</TableCell> */}
        </TableRow>
      </TableHead>
      <TableBody>
        {tasks.map((task) => (
          <TableRow key={task.id}>
            <TableCell>{task.task_id}</TableCell>
            <TableCell>{task.description}</TableCell>
            <TableCell>{task.deadline}</TableCell>
            <TableCell>{task.status}</TableCell>
            {/* <TableCell>{task.priority}</TableCell> */}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const ViewCompletedTasks = () => {
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    fetch('http://127.0.0.1:5000/completedtask/completedtask')
      .then((res) => res.json())
      .then((data) => setTasks(data));
  }, []);

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>ID</TableCell>
          <TableCell>Description</TableCell>
          <TableCell>Deadline</TableCell>
          <TableCell>Status</TableCell>
          {/* <TableCell>Priority</TableCell> */}
        </TableRow>
      </TableHead>
      <TableBody>
        {tasks.map((task) => (
          <TableRow key={task.id}>
            <TableCell>{task.task_id}</TableCell>
            <TableCell>{task.description}</TableCell>
            <TableCell>{task.deadline}</TableCell>
            <TableCell>{task.status}</TableCell>
            {/* <TableCell>{task.priority}</TableCell> */}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};


const App = () => {
  const [open, setOpen] = useState(false); // State to manage the drawer open/close

  // Toggle the drawer
  const toggleDrawer = () => {
    setOpen(!open);
  };

  // const [tasks, setTasks] = useState([]); 
  // console.log("gettaskss", tasks);

  // useEffect(() => {
  //   const fetchTasks = async () => {
  //     try {
  //       const response = await fetch("http://127.0.0.1:5000/viewtask/gettask"); // Replace with your API URL
  //       const data = await response.json();
  //       setTasks(data); // Update state with fetched tasks
  //     } catch (error) {
  //       console.error("Error fetching tasks:", error);
  //     }
  //   };

  //   fetchTasks();
  // }, []);


  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">Task Manager</Typography>
        </Toolbar>
      </AppBar>

      {/* Drawer component for sliding menu */}
      <Drawer
        anchor="left" // Left side of the screen
        open={open} // Whether the drawer is open or not
        onClose={toggleDrawer} // Close the drawer
        variant="temporary" // Temporary drawer for mobile/desktop responsiveness
      >
        <List>
          <ListItem button component={Link} to="/addtask" onClick={() => toggleDrawer()}>
            <ListItemText primary="Add Task" />
          </ListItem>
          <Divider />
          <ListItem button component={Link} to="/viewtasks" onClick={() => toggleDrawer()}>
            <ListItemText primary="View Tasks" />
          </ListItem>
          <ListItem button component={Link} to="/viewpendingtasks" onClick={() => toggleDrawer()}>
            <ListItemText primary="View Pending Tasks" />
          </ListItem>
          <ListItem button component={Link} to="/viewcompletedtasks" onClick={() => toggleDrawer()}>
            <ListItemText primary="View Completed Tasks" />
          </ListItem>
          {/* {tasks.map((task) => (
            <ListItem
              key={task.task_id}
              button
              component={Link}
              to={`/updatetask/${task.task_id}`} // Navigate to update page
              state={{ task }} // Pass task data
              onClick={() => toggleDrawer()}
            >
              <ListItemText primary={`Edit Task ${task.description}`} />
            </ListItem>
          ))} */}
        </List>
      </Drawer>

      <Routes>
        <Route path="/addtask" element={<AddTask />} />
        <Route path="/viewtasks" element={<ViewTasks />} />
        <Route path="/viewpendingtasks" element={<ViewPendingTasks />} />
        <Route path="/viewcompletedtasks" element={<ViewCompletedTasks />} />
        <Route path="/updatetask/:task_id" element={<UpdateTask />} />
      </Routes>
    </Router>
  );
};




export default App;
