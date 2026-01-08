// app.ts
import { APP_PORT } from "./config/env.js";
import express, { type Application } from "express";
import cookieParser from "cookie-parser";

import database from "./database.js";
import "./models/index.js";

import routesAuth from "./routes/routesAuth.js";
import routesUsers from "./routes/routesUsers.js";

const app: Application = express();
const port = APP_PORT;

app.use(cookieParser());
app.use(express.json()); // Middleware do parsowania JSON
app.use("/api", routesAuth);
app.use("/api", routesUsers);

// Synchronizacja z bazą i start serwera
database
    .sync({ alter: true }) // alter: true aktualizuje tabele po zmianie modelu zamiast je usuwać
    .then(() => {
        console.log("Connected to database");

        app.listen(port, () => {
            console.log(`Server is running on: http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.error("Failed to connect to database:", err);
    });
