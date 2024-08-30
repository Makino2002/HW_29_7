const userController = require("./controllers/userController");
const { parse } = require("url");
const { GET, POST, PUT, DELETE } = require("./methods");

function handleRouting(request, response) {
  const parsedUrl = parse(request.url, true);
  const { pathname } = parsedUrl;
  const method = request.method;

  if (method === GET && pathname === "/users") {
    userController.getAllUsers(request, response);
  } else if (method === POST && pathname === "/users") {
    parseRequestBody(request, (body) => {
      request.body = body;
      userController.createUser(request, response);
    });
  } else if (method === GET && pathname.startsWith("/users/")) {
    const id = extractIdFromUrl(pathname);
    request.params = { id };
    userController.getUserById(request, response);
  } else if (method === PUT && pathname.startsWith("/users/")) {
    const id = extractIdFromUrl(pathname);
    request.params = { id };
    parseRequestBody(request, (body) => {
      request.body = body;
      userController.updateUser(request, response);
    });
  } else if (method === DELETE && pathname.startsWith("/users/")) {
    const id = extractIdFromUrl(pathname);
    request.params = { id };
    userController.deleteUser(request, response);
  } else {
    handleNotFound(response);
  }
}

function parseRequestBody(request, callback) {
  let body = "";
  request.on("data", (chunk) => {
    body += chunk;
  });
  request.on("end", () => {
    callback(JSON.parse(body));
  });
}

function extractIdFromUrl(url) {
  const parts = url.split("/");
  return parts[2]; // Assuming the format is "/users/:id"
}

function handleNotFound(response) {
  response.statusCode = 404;
  response.setHeader("Content-Type", "application/json");
  response.end(JSON.stringify({ message: "Not Found" }));
}

module.exports = { handleRouting };
