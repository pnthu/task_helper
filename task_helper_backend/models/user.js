"use strict";
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      username: { type: DataTypes.STRING, allowNull: false },
      password: { type: DataTypes.STRING, allowNull: false },
      fullname: DataTypes.STRING,
      role: { type: DataTypes.STRING, allowNull: false },
      qrCode: DataTypes.INTEGER
    },
    {}
  );
  User.associate = function(models) {
    User.hasMany(models.Task, {
      foreignKey: "assignerId",
      as: "assignsTasks"
    });
    User.hasMany(models.Task, {
      foreignKey: "assigneeId",
      as: "assignedTasks"
    });
  };
  return User;
};
