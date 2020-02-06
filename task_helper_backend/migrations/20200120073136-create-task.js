"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Tasks", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      content: {
        type: Sequelize.STRING
      },
      processContent: {
        type: Sequelize.STRING
      },
      createdDate: {
        allowNull: false,
        type: Sequelize.DATE
      },
      startDate: {
        allowNull: false,
        type: Sequelize.DATE
      },
      endDate: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      comment: {
        type: Sequelize.STRING
      },
      point: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.STRING
      },
      assignerId: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        allowNull: true,
        references: {
          model: "Users",
          key: "id",
          as: "assignerId"
        }
      },
      assigneeId: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        allowNull: true,
        references: {
          model: "Users",
          key: "id",
          as: "assigneeId"
        }
      },
      resourceId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Tasks",
          key: "id",
          as: "resourceId"
        }
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Tasks");
  }
};
