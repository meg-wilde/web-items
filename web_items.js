const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
const port = 3001; //set the port to 3001

app.use(bodyParser.json()); //using bodyParser to parse the JSON requests

// utility function - gets web item data, and creates the file if it doesn't exist
function getItems() {
  try {
    //try to read the content from web_items.json
    const content = fs.readFileSync("web_items.json");
    return JSON.parse(content);
  } catch (e) {
    // if the file doesn't exist create a new file with an empty array.
    fs.writeFileSync("web_items", "[]");
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
  const newItem = req.body; //set the newItem to be the body of the request
  newItem.id = webItems.length + 1; //assign a new ID to the item by adding 1 to the length of the existing array
  webItems.push(newItem); //push the new item into the array of items
  res.json(newItem); //respond with the newly created item
});

// PUT method to update a web item
app.put("/api/:id", (req, res) => {
  const itemId = parseInt(req.params.id); //get the item ID from the request parameters
  const updatedItem = req.body; //get the updated item from the body of the request

  //update the webItems array with the new updated item
  webItems = webItems.map((item) =>
    //iterate over each item in WebItems to find the itemID that matches item.id
    //use a spread operator (...) to create a new item and merge it with the existing item
    item.id === itemId ? { ...item, ...updatedItem } : item
  );

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

//start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}/api`);
});
