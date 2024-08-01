const express = require("express");
const jwt = require("jsonwebtoken");

// Secret key used to sign and verify JWTs (JSON Web Tokens)
const jwtPassword = "123456";

const app = express();

// Middleware to automatically parse JSON data in requests
app.use(express.json());

// A list of all users with their usernames, passwords, and names
const ALL_USERS = [
  {
    username: "harkirat@gmail.com",
    password: "123",
    name: "harkirat singh",
  },
  {
    username: "raman@gmail.com",
    password: "123321",
    name: "Raman singh",
  },
  {
    username: "priya@gmail.com",
    password: "123321",
    name: "Priya kumari",
  },
];

// Check if a user exists in the ALL_USERS list
function userExists(username, password) {
  // Return true if a user with matching username and password is found
  return ALL_USERS.some(
    (user) => user.username === username && user.password === password
  );
}

// Route for user login
app.post("/signin", function (req, res) {
  // Get username and password from request body
  const username = req.body.username;
  const password = req.body.password;

  // Check if the user exists with the provided username and password
  if (!userExists(username, password)) {
    // If user does not exist, return a 403 Forbidden status
    return res.status(403).json({
      msg: "User doesn't exist in our in-memory DB",
    });
  }

  // Create a JWT token containing the username as payload
  var token = jwt.sign({ username: username }, jwtPassword);

  // Send the token back to the client
  return res.json({
    token,
  });
});

// Route to get a list of users, excluding the one who is logged in
app.get("/users", function (req, res) {
  // Get the JWT token from request headers 
  const token = req.headers.authorization;

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, jwtPassword);

    // Get the username from the decoded token
    const username = decoded.username;

    // Filter the list to exclude the current user
    const otherUsers = ALL_USERS.filter(
      (user) => user.username !== username
    );

    // Send the list of other users back to the client
    return res.json(otherUsers);
  } catch (err) {
    // If token verification fails, return a 403 Forbidden status
    return res.status(403).json({
      msg: "Invalid token",
    });
  }
});

// Start the server and listen on port 3000
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
