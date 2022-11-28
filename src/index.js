const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

const app = express();

const server = require("http").Server(app); // server supports http protocol
const io = require("socket.io")(server); // websocket requests

var env = require("dotenv").config();

mongoose
  .connect(
    "mongodb://" +
      process.env.COSMOSDB_HOST +
      ":" +
      process.env.COSMOSDB_PORT +
      "/" +
      process.env.COSMOSDB_DBNAME +
      "?ssl=true&replicaSet=globaldb",
    {
      auth: {
        username: process.env.COSMOSDB_USER,
        password: process.env.COSMOSDB_PASSWORD,
      },
      useNewUrlParser: true,
      useUnifiedTopology: true,
      retryWrites: false,
    }
  )
  .then(() => console.log("Connection to CosmosDB successful"))
  .catch((err) => console.error(err));

// creating our own middleware
app.use((req, res, next) => {
  req.io = io;

  next();
});

app.use(cors());

app.use(
  "/files",
  express.static(path.resolve(__dirname, "..", "uploads", "resizeds"))
);

app.use(require("./routes"));

server.listen(3333);
