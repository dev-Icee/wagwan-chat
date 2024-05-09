import fs from "fs";
import Users from "../models/userModel.js";
import connectDB from "../utils/connectDB.js";
import dotenv from "dotenv";
// Import Users
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: "../config.env" });

console.log(process.env.DB_URL);
connectDB(process.env.DB_URL);

console.log(`${__dirname}`);

const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf-8"));

const importDbData = async () => {
  try {
    await Users.create(users);
    console.log("Data imported Successfully...");
  } catch (err) {
    console.log("Data could not be imported...");
    console.log(err);
  }
  process.exit();
};

const deleteDbData = async () => {
  try {
    await Users.deleteMany();
    console.log("Data deleted sucessfully...");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === "--import") {
  importDbData();
} else if (process.argv[2] === "--delete") {
  deleteDbData();
}
