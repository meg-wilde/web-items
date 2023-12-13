import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [projects, setProjects] = useState([]); //create a state to store the project list
  const [newProject, setNewProject] = useState({
    //create a state to store the new projects details
    title: "",
    description: "",
    URL: "",
  });
  const [editingProjectId, setEditingProjectId] = useState(null); //state to store the ID of the project being edited

  //when the component mounts, run the function to fetch projects from server
  useEffect(() => {
    fetchProjects();
  }, []);

  //function to fetch the projects from the server
  const fetchProjects = async () => {
    const response = await fetch("http://localhost:3001/api");
    const projects = await response.json();
    console.log("Fetched projects:", projects);
    setProjects(projects);
  };

  //function to add a new project using POST
  const addProject = async () => {
    const response = await fetch("http://localhost:3001/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProject),
    });

    // If successful, fetch updated projects and reset newProject state
    if (response.ok) {
      fetchProjects();
      setNewProject({ title: "", description: "", URL: "" });
    }
  };

  //function to delete a project using DELETE
  const deleteProject = async (id) => {
    const response = await fetch(`http://localhost:3001/api/${id}`, {
      method: "DELETE",
    });

    // If successful, fetch updated projects
    if (response.ok) {
      fetchProjects();
    }
  };

  //function to edit a project
  const editProject = (id) => {
    // Set the project to edit and switch to editing mode
    const projectToEdit = projects.find((project) => project.id === id);
    setNewProject(projectToEdit);
    setEditingProjectId(id);
  };

  //function to save the changes made during editing
  const saveEditedProject = async () => {
    // Save the edited project using PUT and exit editing mode
    const response = await fetch(
      `http://localhost:3001/api/${editingProjectId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProject),
      }
    );

    // If successful, fetch updated projects and reset states
    if (response.ok) {
      fetchProjects();
      setNewProject({ title: "", description: "", URL: "" });
      setEditingProjectId(null);
    }
  };

  return (
    <div className="App">
      <h2>Web Projects</h2>
      {/* display an info banner to help the user edit when in editing mode */}
      {editingProjectId !== null && (
        <div className="edit-banner">
          Please edit the details and click Save.
        </div>
      )}
      <div>
        {/* input fields for new project */}
        <label>Title:</label>
        <input
          type="text"
          className="title"
          value={newProject.title}
          onChange={(e) =>
            setNewProject({ ...newProject, title: e.target.value })
          }
        />
        <label>Description:</label>
        <input
          type="text"
          className="description"
          value={newProject.description}
          onChange={(e) =>
            setNewProject({ ...newProject, description: e.target.value })
          }
        />
        <label>URL:</label>
        <input
          type="text"
          className="url"
          value={newProject.URL}
          onChange={(e) =>
            setNewProject({ ...newProject, URL: e.target.value })
          }
        />
        {/* create a button to add the project but disable it when in edit mode */}
        <button
          className="add-button"
          onClick={addProject}
          disabled={editingProjectId !== null}
        >
          Add Project
        </button>
      </div>
      <table>
        {/* table to display current project list */}
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>URL</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* map the projects to show them in the table */}
          {projects.map((project) => (
            <tr key={project.id}>
              <td>{project.id}</td>
              <td>{project.title}</td>
              <td>{project.description}</td>
              <td>{project.URL}</td>
              <td>
                {/* show save and cancel buttons when in edit mode*/}
                {editingProjectId === project.id ? (
                  <>
                    {/* save button initiates the saveEditedProject function */}
                    <button className="save-button" onClick={saveEditedProject}>
                      Save
                    </button>
                    {/* cancel button exits edi mode */}
                    <button
                      className="cancel-button"
                      onClick={() => setEditingProjectId(null)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    {/* edit button enters into edit mode function */}
                    <button
                      className="edit-button"
                      onClick={() => editProject(project.id)}
                    >
                      Edit
                    </button>
                    {/* delete button initiates the deleteProject function */}
                    <button
                      className="delete-button"
                      onClick={() => deleteProject(project.id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
