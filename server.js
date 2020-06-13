const express = require('express')
const app = express();
const path = require("path");

require("dotenv").config();

app.use(express.json());
app.use('/api', require("./routes"))

if (process.env.NODE_ENV === "production") {
  // Serve any static files
  app.use(express.static(path.join(__dirname, "client/build")));
  // Handle React routing, return all requests to React app
  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000;
const serveHost = process.env.YOUR_HOST || "0.0.0.0";

app.listen(port, serveHost, () => {
  console.log(`Server running on ${port}`);
});