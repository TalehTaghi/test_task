import { DataTypes, Model } from "sequelize";
import sequelize from "../db/sequelize.js";

class User extends Model {}

User.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    surname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, { timestamps: false, sequelize, modelName: 'user' });

export default User;