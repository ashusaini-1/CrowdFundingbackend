const logger = require("./logger/logger");
const dotenv = require("dotenv");
const app = require("./app");
const connectDatabase = require("./config/db");

let server; // Define the server variable

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Uncaught Exception`);
  process.exit(1);
});

dotenv.config({ path: "config/config.env" });

connectDatabase();

const PORT = process.env.PORT || 5500;
logger.info(PORT);

server = app.listen(PORT, () => { // Capture the server instance
  console.log(`Server is running on this Port: ${PORT}`);
});

// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Unhandled Promise Rejection`);

  server.close(() => {
    process.exit(1);
  });
});
