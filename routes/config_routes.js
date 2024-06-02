const path = require("path")
const indexR = require("./index");
const usersR = require("./users");
const coursesR = require("./courses");
const videosR = require("./videos");
const sendEmailR = require("./send_email")
const shabatR = require("./shabat");
const lifeTimeR = require("./lifetime");

exports.routesInit = (app) => {
  app.use("/",indexR);
  app.use("/users", usersR);
  app.use("/courses", coursesR);
  app.use("/videos", videosR);
  app.use("/send_email", sendEmailR);
  app.use("/shabat", shabatR);
  app.use("/lifetime", lifeTimeR);


  app.use((req,res) => {

    res.sendFile(path.join(__dirname, '../public/index.html'))
    // res.status(404).json({msg_error:"Url not found , 404!"})
  })
}


exports.corsAccessControl = (app) => {
  app.all('*', function (req, res, next) {
    if (!req.get('Origin')) return next();
    res.set('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, PATCH");
    res.set('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,auth-token,x-api-key');
    next();
  });
}