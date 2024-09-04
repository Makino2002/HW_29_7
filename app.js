const http = require("http");
// const { handleRouting } = require("./routers");
const { handleRouting } = require("./routes/route");

// Define the port the server will listen on
const PORT = process.env.PORT || 3000;

// Create the HTTP server
const server = http.createServer((request, response) => {
  try {
    handleRouting(request, response);
  } catch (error) {
    // Basic error handling
    console.error("Unexpected error:", error);
    response.statusCode = 500;
    response.setHeader("Content-Type", "application/json");
    response.end(JSON.stringify({ message: "Internal Server Error" }));
  }
});

// Start the server and listen on the specified port
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1); // Optional: exit the process with an error code
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
