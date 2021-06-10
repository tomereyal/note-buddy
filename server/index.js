const express = require("express");

//https://www.freecodecamp.org/news/express-explained-with-examples-installation-routing-middleware-and-more/

/*
We need to define an instance of the express module we imported which handles the..
..request and response from the server to the client. 
In our case, it is the variable app.
*/
const app = express();
const path = require("path");
const cors = require("cors");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const config = require("./config/key");

// const mongoose = require("mongoose");
// mongoose
//   .connect(config.mongoURI, { useNewUrlParser: true })
//   .then(() => console.log("DB connected"))
//   .catch((err) => console.error(err));

const mongoose = require("mongoose");
const connect = mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

mongoose.set("useFindAndModify", false); // To get rid of the warnings in the console

app.use(cors());

//to not get any deprecation warning or error
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
//to get json data
// support parsing of application/json type post data
app.use(bodyParser.json());
app.use(cookieParser());

/*Lets create two endpoints for our clients
one with the uri: "/api/users"
and another with the uri:  "/api/blog"
including /api/ in the endpoints makes our code clearer that we want to access our mongoDB api

Everytime a client will make an HTTP request (e.g. axious post request) to the endpoint 
we will express will import a module */
app.use("/api/users", require("./routes/users"));
app.use("/api/blog", require("./routes/blog"));
app.use("/api/folder", require("./routes/folder"));

/* Above we used a modular route handler for the the two routes.
Use the express.Router class to create modular, mountable route handlers. 
A Router instance is a complete middleware and routing system; for this reason, 
it is often referred to as a “mini-app”.

The following example creates a router as a module, loads a middleware function in it,
 defines some routes, and mounts the router module on a path in the main app.

 */

/*The express.static(file path) it is a built in middleware function */
//use this to show the image you have in node js server to client (react js)
//https://stackoverflow.com/questions/48914987/send-image-path-from-node-js-express-server-to-react-client
app.use("/uploads", express.static("uploads"));

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  // All the javascript and css files will be read and served from this folder
  app.use(express.static("client/build"));

  // index.html for all page routes    html or routing and naviagtion
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000;

/*The listen method starts our server.
 and it defines where (which port) we (the hosts middleware) will 
 listen to incoming requests from a client*/
app.listen(port, () => {
  console.log(`Server Listening on ${port}`);
});
