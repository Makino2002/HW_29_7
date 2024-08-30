const http = require("http");
const { handleRouting } = require("./router");

const PORT = process.env.PORT || 3000;

const server = http.createServer((request, response) => {
  handleRouting(request, response);
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
