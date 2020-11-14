import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import routes from "./src/routes/crmRoutes";
import jwt from "jsonwebtoken";

const app = express();
const PORT = 3000;

// mongoose connection
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/CRMdb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// bodyparser setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// JWT setup
app.use((req, res, next) => {
  if (
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "JWT"
  ) {
    jwt.verify(
      req.headers.authorization.split(" ")[1],
      "RESTFULAPIs",
      (err, decode) => {
        if (err) {
            req.user = undefined;
        } else {
            req.user = decode;
        }
        next();
      }
    );
  } else {
    req.user === undefined;
    next();
  }
});

routes(app);

// serving static files
app.use(express.static("public"));

app.get("/", (req, res) =>
  res.send(`Node and express server is running on port ${PORT}`)
);

app.listen(PORT, () => console.log(`your server is running on port ${PORT}`));
