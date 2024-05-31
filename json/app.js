// ספריית אקספרס
const express = require("express");
// מבצע מינפולציה על נתיבים בכתובות יו אר אל
const path = require("path");
// מפעיל שרת
const http = require("http");
// ספרייה שמאפשרת בקשות מדומיין אחר לשרת לשנו
const cors = require("cors");
//ספרייה שמאפשרת לנו עבודה עם קוקיס באקספרס
const cookieParser = require("cookie-parser");

// התחברות למסד נתונים מונגו
require("./db/mongoConnect");
// פונקציה שבהפעלה מגדירה ראוטים של השרת שלנו
const { routesInit } = require("./routes/configRoutes");

// מגדירים משתנה שהוא מייצג את האקפרס והיכולות שלו
const app = express();

//אובייקט שהוספנו לקורס על מנת שיוכל לעבוד מול בקשות צד לקוח בדפדפן
// כגון מאפליקציית ריאקט עם קוקיס
app.use(cors({ origin: true, credentials: true }));

app.use(cookieParser());

// מגדיר שאקספרס ידע לקבל באדי בבקשות פוסט ו עריכה
app.use(express.json());

// מגדירים את תקיית פאבליק כתקייה סטטית שחשופה לצד לקוח
app.use(express.static(path.join(__dirname, "public")));

// מגדיר את הראוטרים של האפליקציה שלנו כשהשרת יעבוד
routesInit(app);

// מפעיל שרת
const server = http.createServer(app);
server.listen(3001);
