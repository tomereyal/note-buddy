const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const config = require("./config/key");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const axios = require("axios");
const morgan = require("morgan");

//https://www.freecodecamp.org/news/express-explained-with-examples-installation-routing-middleware-and-more/

/*
We need to define an instance of the express module we imported which handles the..
..request and response from the server to the client. 
In our case, it is the variable app.
*/

const app = express();

// const mongoose = require("mongoose");
// mongoose
//   .connect(config.mongoURI, { useNewUrlParser: true })
//   .then(() => console.log("DB connected"))
//   .catch((err) => console.error(err));
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

//app.use method gets 2 params: a path and a callback function/s
//if no path is "mounted" to the method app.use(_,callback()), path defaults to "/"..
//so the specified middleware function will be executed for every request to the app.

app.use(cors());

//So above (cross origin request method, cors(), will fire on every request to the app)

//to not get any deprecation warning or error
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
//to get json data
// support parsing of application/json type post data
app.use(bodyParser.json());
app.use(cookieParser());

//initialize a session..and connect it to the existing mongoose connection
app.use(
  session({
    secret: "mysecretstore",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: config.mongoURI }),
    cookie: { maxAge: 14 * 24 * 60 * 60 * 1000 }, //14 days in milliseconds.. the duration of a session before mongoDB erases it..
  })
);

//make the session available to the view components.. Attach the session store to each response..

app.use(function (req, res, next) {
  // const db = mongoose.connection;
  // console.log(`db`, db);
  // console.log(`req`, req.session);
  res.locals.session = req.session; // response.vs request! mind the difference
  // console.log(`res.locals.session`, res.locals.session.cats);
  next();
});

/*Lets create two endpoints for our clients
one with the uri: "/api/users"
and another with the uri:  "/api/blog"
including /api/ in the endpoints makes our code clearer that we want to access our mongoDB api

Everytime a client will make an HTTP request (e.g. axious post request) to the endpoint 
we will express will import a module */
app.use("/api/users", require("./routes/users"));
app.use("/api/blog", require("./routes/blog"));
app.use("/api/folder", require("./routes/folder"));
app.use("/api/settings", require("./routes/settings"));
app.use("/api/card", require("./routes/card"));
app.use("/api/chain", require("./routes/chain"));
app.use("/api/external", require("./routes/external"));
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
app.use(morgan("combined"));
/*The listen method starts our server.
 and it defines where (which port) we (the hosts middleware) will 
 listen to incoming requests from a client*/
app.listen(port, () => {
  console.log(`Server Listening on ${port}`);
});

//research production/development stages of porject// react is running on localhost:3000
//my server is running on localhost:5000 .. the reason why my get image file didnt work.. wrong path

//npm run build :  will make client a static file on the server
