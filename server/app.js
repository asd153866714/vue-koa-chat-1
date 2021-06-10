const Koa = require("koa");
const koaBody = require("koa-body");
const koaLogger = require("koa-logger");
const cors = require("@koa/cors");
const mongoose = require("mongoose");

require("dotenv").config();
const PORT = process.env.PORT || 3000;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/Vue-Koa-Chat";

const app = new Koa();

// init socket.io
const server = require("http").createServer(app.callback());
const socketIoConfig = require("./socket");
socketIoConfig.init(server);

// init middleware
app.use(koaBody());
app.use(koaLogger());
// set CORS
app.use(
  cors({
    origin: function (ctx) {
      return "*";
    },
    exposeHeaders: ["WWW-Authenticate", "Server-Authorization"],
    maxAge: 5,
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "DELETE"],
    allowHeaders: ["Content-Type", "Authorization", "Accept"],
  })
);

// init routes
const Routes = require("./routes/index.js");
app.use(Routes.routes());

// connect to mongodb
mongoose.connect(`${MONGODB_URI}`, {
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = server.listen(PORT, () => {
  console.log(`Server run on http://localhost:${PORT}`);
});
