const statusCode = require("./statusCode");
const { v4: uuidv4 } = require("uuid");
const users = [
  { id: 1, name: "Nguyễn Minh Mẫn" },
  { id: 2, name: "Mai Minh Mẫn" },
];

function getAllUsers(request, response) {
  response.statusCode = statusCode.OK;
  response.setHeader("Content-Type", "application/json");
  response.end(JSON.stringify(users));
}

function createUser(request, response) {
  const newUser = request.body;
  newUser.id = uuidv4();
  users.push(newUser);
  response.statusCode = statusCode.CREATED;
  response.setHeader("Content-Type", "application/json");
  response.end(JSON.stringify(newUser));
}

function getUserById(request, response) {
  const userId = parseInt(request.params.id, 10);
  const user = users.find((u) => u.id === userId);
  if (user) {
    response.statusCode = statusCode.OK;
    response.setHeader("Content-Type", "application/json");
    response.end(JSON.stringify(user));
  } else {
    response.statusCode = statusCode.NOT_FOUND;
    response.setHeader("Content-Type", "application/json");
    response.end(JSON.stringify({ message: "User not found" }));
  }
}

function updateUser(request, response) {
  const userId = parseInt(request.params.id, 10);
  const userIndex = users.findIndex((u) => u.id === userId);
  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], ...request.body };
    response.statusCode = statusCode.OK;
    response.setHeader("Content-Type", "application/json");
    response.end(JSON.stringify(users[userIndex]));
  } else {
    response.statusCode = statusCode.NOT_FOUND;
    response.setHeader("Content-Type", "application/json");
    response.end(JSON.stringify({ message: "User not found" }));
  }
}

function deleteUser(request, response) {
  const userId = parseInt(request.params.id, 10);
  const userIndex = users.findIndex((u) => u.id === userId);
  if (userIndex !== -1) {
    users.splice(userIndex, 1);
    response.statusCode = 204;
    response.end();
  } else {
    response.statusCode = 404;
    response.setHeader("Content-Type", "application/json");
    response.end(JSON.stringify({ message: "User not found" }));
  }
}

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
};
