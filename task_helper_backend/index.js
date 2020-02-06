const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const app = express();

// app.use(logger("dev"));
app.use(bodyParser.json());
// app.use(cors);
app.use(bodyParser.urlencoded({ extended: false }));

var models = require("./models");

models.sequelize
  .sync()
  .then(() => {
    console.log("Opened successfully!");
  })
  .catch(error => {
    console.log("Something error: " + error);
  });

// const router = require("./routes");
const router = express.Router();
app.use("/api", router);

app.post("/api/users/create", (req, res) => {
  return res.status(200).send({});
  // return User.create({
  //   username: req.body.username,
  //   password: req.body.password,
  //   fullname: req.body.fullname,
  //   role: req.body.role
  // })
  //   .then(user => res.status(201).send(user))
  //   .catch(error => res.status(400).send(error));
});

app.get("*", (req, res) =>
  res.status(200).send({
    message: "Welcome to the beginning of nothingness."
  })
);

const port = parseInt(process.env.PORT, 10) || 3000;
app.set("port", port);
const server = http.createServer(app);
server.listen(port);

module.exports = app;

// app.listen(5002, () => {
//   console.log("Listening at port 3000");
// });
