const userController = require("../controllers/controller"); // Adjust the path as needed
const routes = require("./routes.js");
const httpStatusCodes = require("../controllers/statusCode");
const { GET, POST, PUT, DELETE } = require("./methods");

function handleRouting(request, response) {
  const { url, method } = request;
  console.log(routes);
  switch (method) {
    case GET:
      if (url === routes.users.value) {
        userController.getAllUsers(request, response);
      } else if (url.startsWith("/users/")) {
        // Handle dynamic /users/:id
        const id = extractIdFromUrl(url);
        request.params = { id };
        userController.getUserById(request, response);
      } else {
        handleNotFound(response);
      }
      break;

    case POST:
      if (url === routes.users.value) {
        parseRequestBody(request, (body) => {
          request.body = body;
          userController.createUser(request, response);
        });
      } else {
        handleNotFound(response);
      }
      break;

    case PUT:
      if (url.startsWith("/users/")) {
        // Handle dynamic /users/:id
        const id = extractIdFromUrl(url);
        request.params = { id };
        parseRequestBody(request, (body) => {
          request.body = body;
          userController.updateUser(request, response);
        });
      } else {
        handleNotFound(response);
      }
      break;

    case DELETE:
      if (url.startsWith("/users/")) {
        // Handle dynamic /users/:id
        const id = extractIdFromUrl(url);
        request.params = { id };
        userController.deleteUser(request, response);
      } else {
        handleNotFound(response);
      }
      break;

    default:
      handleMethodNotAllowed(response);
      break;
  }
}

function parseRequestBody(request, callback) {
  let body = "";
  request.on("data", (chunk) => {
    body += chunk;
  });
  request.on("end", () => {
    try {
      callback(JSON.parse(body));
    } catch (e) {
      response.statusCode = 400; // Bad Request
      response.setHeader("Content-Type", "application/json");
      response.end(JSON.stringify({ message: "Invalid JSON" }));
    }
  });
}

function extractIdFromUrl(url) {
  // Extract the ID from a URL like "/users/123"
  const parts = url.split("/");
  return parts[parts.length - 1]; // Return the last part as ID
}

function handleNotFound(response) {
  response.statusCode = httpStatusCodes.NOT_FOUND;
  response.setHeader("Content-Type", "application/json");
  response.end(JSON.stringify({ message: "Not Found" }));
}

function handleMethodNotAllowed(response) {
  response.statusCode = httpStatusCodes.METHOD_NOT_ALLOWED;
  response.setHeader("Content-Type", "text/plain");
  response.end("Method Not Allowed");
}

module.exports = {
  handleRouting,
};
