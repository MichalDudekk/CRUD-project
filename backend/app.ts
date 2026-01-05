import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Ładowanie .env z katalogu wyżej
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const sequelize = new Sequelize(
    process.env.DB_NAME!,
    process.env.DB_USER!,
    process.env.DB_PASSWORD!,
    {
        host: "127.0.0.1",
        dialect: "postgres",
        // logging: false // wyłączenie logów w konsoli
    }
);

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log("Connected to database");
    } catch (error) {
        console.error("Could not connect to database", error);
    }
}

testConnection();
