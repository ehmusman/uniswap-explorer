const express = require("express");

const app = express();
const cors = require("cors");
app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next()
})

// initialize All Routes
require("./startup/routes")(app)

app.get("/", (req,res) => {
  res.status(200).send("Server is running")
})
app.all("*", (req,res) => {
  res.status(400).send("Bad Request")
})
const port = process.env.PORT;
app.listen(port, () => console.log(`App is Listening on port ${port}`));
