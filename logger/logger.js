//logger
const winston = require("winston");
const logger = winston.createLogger({
  level: "info", // Set the logging level (info, error, debug, etc.)
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ level, message }) => {
      return `[${level}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(), 
    new winston.transports.File({ filename: "error.log", level: "error" }), // Log errors to a file
    new winston.transports.File({ filename: "combined.log" }), // Log all levels to another file
  ],
});

module.exports = logger;
