const express = require('express');
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");

require("dotenv").config(); // load env file
const app = express();
const port = process.env.PORT;
const publicDirectoryPath = path.join(__dirname, "./public");

// EXPRESS SERVER SETTINGS
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(publicDirectoryPath));

require("./routes/.load_routes")(app);

app.listen(port, () => {
    console.log("Server is up on port " + port);
});