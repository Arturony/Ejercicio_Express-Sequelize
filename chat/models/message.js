const { DataTypes, Model } = require("sequelize");
const sequelize = require("../lib/sequelize");

class Message extends Model {}

Message.init(
  {
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ts: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
  },
  {
    sequelize,
    modelName: "Message",
  }
);

Message.sync();

module.exports = Message;