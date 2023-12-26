const express = require("express");
const fs = require("fs");
const path = require("path"); //import the path module

const app = express();
const port = process.env.PORT || 3001; //set the port to 3001

// Serve static files from the React build
app.use(express.static(path.join(__dirname, "frontend/build")));

app.use(express.json()); //using express.json() to parse JSON requests

// utility function - gets web item data, and creates the file if it doesn't exist
function getItems() {
  try {
    //try to read the content from web_items.json
    const content = fs.readFileSync("web_items.json");
    return JSON.parse(content);
  } catch (e) {
    // if the file doesn't exist create a new file with an empty array.
    fs.writeFileSync("web_items.json", "[]");
    return [];
  }
}

//set webItems to be the items retrieved from the web_items.json file
let webItems = getItems();

// Get all web items
app.get("/api", (req, res) => {
  //respond with JSON array of the web items
  res.json(webItems);
});

// POST method to a new web item
app.post("/api", (req, res) => {
  const { title, description, URL } = req.body; //destructure the properties from the request body
  const newItemId = webItems.length + 1; //set the newItemId by adding 1 to the length of the existing array
  //create a new item object with all the properties
  const newItem = {
    id: newItemId,
    title,
    description,
    URL,
  };

  webItems.push(newItem); //push the new item into the array of items

  // Save the updated items to the file
  fs.writeFileSync("web_items/json", JSON.stringify(webItems, null, 2));
  // Respond with the newly created item
  res.json(newItem);
});

// PUT method to update a web item
app.put("/api/:id", (req, res) => {
  const itemId = parseInt(req.params.id); //get the item ID from the request parameters
  const { title, description, URL } = req.body; //get the updated properties and destructure them from the body of the request

  //update the webItems array with the new updated item
  webItems = webItems.map((item) =>
    //iterate over each item in WebItems to find the itemID that matches item.id
    //use a spread operator (...) to create a new item and merge it with the existing item
    item.id === itemId ? { ...item, title, description, URL } : item
  );

  //Save the updated items to the file
  fs.writeFileSync("web_items.json", JSON.stringify(webItems, null, 2));

  //respond with the updated web item
  //use find to find the item that was just updated by matching item.id to itemId
  //return the newly updated item
  res.json(webItems.find((item) => item.id === itemId));
});

//DELETE method to delete a web item
app.delete("/api/:id", (req, res) => {
  const itemId = parseInt(req.params.id); //get the item ID from the request parameters
  //filter out the item ID from the webItems array by checking item.id matches itemId
  //if the id does not match the then Id is included in the new array
  //if the id matches the Id id excluded, effectively deleting it
  webItems = webItems.filter((item) => item.id !== itemId);
  res.sendStatus(204); //Respond with the status for content not found
});

// Handle other routes by serving the React app's index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/build/index.html"));
});

//start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
