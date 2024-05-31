const indexR = require("./index");
const usersR = require("./users");
const toysR = require("./toys");
const categoriesR = require("./categories");
const aiR = require("./ai");

exports.routesInit = (app) => {
  // הגדרת ראוטים לאיזה ראוטר הם שייכים
  app.use("/", indexR);
  app.use("/users", usersR);
  app.use("/toys", toysR);
  app.use("/categories", categoriesR);
  app.use("/ai", aiR);
};
