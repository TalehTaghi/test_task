import { DataTypes, Model } from "sequelize";
import sequelize from "../db/sequelize.js";

class File extends Model {}

File.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    extension: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    mimeType: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    size: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    }
}, { timestamps: true, sequelize, modelName: 'file' });

export default File;