// app.ts
import { APP_PORT } from "./config/env.js";
import express, { type Application } from "express";

import database from "./database.js";
import "./models/index.js";

import routesUsers from "./routes/routesUser.js";

const app: Application = express();
const port = APP_PORT;

app.use(express.json()); // Middleware do parsowania JSON
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
