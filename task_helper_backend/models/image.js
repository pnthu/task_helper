"use strict";
module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define(
    "Image",
    {
      src: DataTypes.STRING
    },
    {}
  );
  Image.associate = function(models) {
    Image.belongsTo(models.Task, {
      foreignKey: "taskId",
      onDelete: "CASCADE"
    });
  };
  return Image;
};
