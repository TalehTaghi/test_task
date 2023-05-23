import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import sequelize from './db/sequelize.js';
import authRoutes from './routes/auth.js';
import fileRoutes from './routes/file.js';
import isAuthMiddleware from "./middleware/is-auth.middleware.js";

dotenv.config({ path: './.env' });

sequelize.sync()
    .then(() => { console.log("Synced db."); })
    .catch((error) => { console.log("Failed to sync db: " + error.message); });

const app = express();

app.use(cors({ options: '*' }));

app.use(bodyParser.json());

app.use('/', authRoutes);
app.use('/file', isAuthMiddleware, fileRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});