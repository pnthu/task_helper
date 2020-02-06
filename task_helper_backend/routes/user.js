const userController = require("../controllers/user");

module.exports = app => {
  app.get("/login", userController.login);
  app.post("/create", (req, res) => {
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
};
