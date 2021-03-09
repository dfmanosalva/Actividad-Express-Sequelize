const { DataTypes, Model } = require("sequelize");
const sequelize = require("../lib/sequelize");

class Message extends Model {}

Message.init(
    {
        message: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        author: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        ts: {
            type: DataTypes.TIME,
            allowNull: false,
            primaryKey: true,
        },
    },
    {
        sequelize,
        modelName: "Message",
        timestamps: false
    }
);

Message.sync();

module.exports = Message;
