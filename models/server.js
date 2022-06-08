const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const { createServer } = require("http");
const socketIO = require("socket.io");

const { dbConnection } = require("../database/config");
const { socketController } = require("../sockets/controller");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.server = createServer(this.app);
    this.io = socketIO(this.server);

    this.paths = {
      auth: "/api/auth",
      categories: "/api/categories",
      products: "/api/products",
      search: "/api/search",
      upload: "/api/upload",
      users: "/api/users",
    };

    // Connect to database
    this.connectDB();

    // Middlewares
    this.middlewares();

    // Routes
    this.routes();

    // Socket
    this.sockets();
  }

  async connectDB() {
    await dbConnection();
  }

  middlewares() {
    // CORS
    this.app.use(cors());

    // Body Parser
    this.app.use(express.json());

    // Static files
    this.app.use(express.static("public"));

    // Fileupload
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
        createParentPath: true,
      })
    );
  }

  routes() {
    this.app.use(this.paths.auth, require("../routes/auth"));
    this.app.use(this.paths.categories, require("../routes/categories"));
    this.app.use(this.paths.products, require("../routes/products"));
    this.app.use(this.paths.search, require("../routes/search"));
    this.app.use(this.paths.upload, require("../routes/upload"));
    this.app.use(this.paths.users, require("../routes/users"));
  }

  sockets() {
    this.io.on("connection", (socket) => socketController(socket, this.io));
  }

  listen() {
    this.server.listen(this.port, () => {
      console.log("Server on port", this.port);
    });
  }
}

module.exports = Server;
