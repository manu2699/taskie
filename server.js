const express = require('express')
const app = express();

require("dotenv").config();

app.use(express.json());
app.use('/api', require("./routes"))

var server = app.listen(5000, () => {
  console.log(`Server running on 5000`);
});
