const indexR = require("./index");
const usersR = require("./users");
const toysR = require("./toys");
const categoriesR = require("./categories");
const aiR = require("./ai");
const path = require("path")

exports.routesInit = (app) => {
  // הגדרת ראוטים לאיזה ראוטר הם שייכים
  app.use("/", indexR);
  app.use("/users", usersR);
  app.use("/toys", toysR);
  app.use("/categories", categoriesR);
  app.use("/ai", aiR);

  app.use((req,res) => {

    res.sendFile(path.join(__dirname, '../public/index.html'))
    // res.status(404).json({msg_error:"Url not found , 404!"})
  })
};
