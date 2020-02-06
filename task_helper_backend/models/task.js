"use strict";
module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define(
    "Task",
    {
      name: { type: DataTypes.STRING, allowNull: false },
      content: DataTypes.STRING,
      processContent: DataTypes.STRING,
      startDate: DataTypes.DATE,
      endDate: DataTypes.DATE,
      comment: DataTypes.STRING,
      point: DataTypes.INTEGER,
      status: DataTypes.STRING
    },
    {}
  );
  Task.associate = function(models) {
    Task.belongsTo(models.User, {
      foreignKey: "assignerId",
      onDelete: "CASCADE"
    });
    Task.belongsTo(models.User, {
      foreignKey: "assigneeId",
      onDelete: "CASCADE"
    });
    Task.hasMany(models.Task, {
      foreignKey: "resourceId",
      as: "refTasks"
    });
    Task.belongsTo(models.Task, {
      foreignKey: "resourceId"
    });
    Task.hasMany(models.Image, {
      foreignKey: "taskId",
      as: "images"
    });
  };
  return Task;
};
