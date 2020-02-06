const User = require("../models/user");

module.exports = {
  login(req, res) {
    return User.findAll({
      attributes: ["username", "role"],
      where: {
        username: req.body.username,
        password: req.body.password
      }
    })
      .then(permission => res.status(201).send(permission))
      .catch(error => res.status(400).send(error));
  },

  create: (req, res) => {
    return res.status(200).send({});
    // return User.create({
    //   username: req.body.username,
    //   password: req.body.password,
    //   fullname: req.body.fullname,
    //   role: req.body.role
    // })
    //   .then(user => res.status(201).send(user))
    //   .catch(error => res.status(400).send(error));
  }
};
