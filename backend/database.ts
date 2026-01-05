// database.ts
import { Sequelize } from "sequelize";
import { DB_NAME, DB_USER, DB_PASSWORD } from "./config/env.js";

const database = new Sequelize(DB_NAME!, DB_USER!, DB_PASSWORD!, {
    host: "127.0.0.1",
    dialect: "postgres",
    // logging: false, // Wyłącza logi SQL w konsoli
});

export default database;
