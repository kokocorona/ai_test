const express = require("express");
const bcrypt = require("bcrypt")
const { UserModel, validateUser, validateLogin, genToken } = require("../models/userModel");
const { auth, makePaid, authAdmin, checkPaypalTokenSand } = require("../middlewares/auth");
const { config } = require("../config/secret");
const { route } = require(".");
const { sendEmailPay } = require("../middlewares/email_manager");
const router = express.Router();


// checkPaypalTokenSand("A21AAKqC7XZjcjhLVhheKd0uPA0batCBZ4-UdggVcAZCdtwyrHco63kZRsekq4rRLNTziZlwEZ798XdyLpTqheTbsgzTeRUVg","4838492813089334W")

router.get("/", (req, res) => {
  res.json({ msg: "Users work" })
})

router.get("/myInfo", auth, async (req, res) => {
  try {
    // console.log(req.userToken._id)
    let user = await UserModel.findOne({ _id: req.userToken._id }, { password: 0 })
    res.json(user);
  }
  catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
})

router.get("/list", authAdmin, async (req, res) => {
  try {
    let perPage = req.query.perPage || 20;
    let page = req.query.page || 1;
    let sort = req.query.sort || "_id"
    let s = req.query.s;
    let myFind = {};
    if(s){
      let sExp = new RegExp(s,"i");
      myFind = {$or:[{name:sExp},{email:sExp},{role:sExp}]}
    }
    let data = await UserModel.find(myFind)
      .limit(Number(perPage))
      .skip((page - 1) * perPage)
      .sort({[sort]:-1});
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
})

router.get("/userInfo/:id", authAdmin, async(req,res) => {
  try{
    let user = await UserModel.findOne({ _id: req.params.id }, { password: 0 })
    res.json(user);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})

router.get("/amount" , authAdmin, async (req,res) => {
  try{
    let amount = await UserModel.countDocuments({});
    res.json({amount})
  }
  catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
})

router.get("/authUser", auth, (req, res) => {
  res.json({ status: "ok", user_id: req.userToken._id, role: req.userToken.role });
})

// תשלום בפאי פאל או כרטיס אשראי
router.post("/user_pay", auth, async (req, res) => {
  if (req.body.pay_kind && req.body.token_id && req.body.pay_kind) {
    let transiction = await checkPaypalTokenSand(req.body.token_id, req.body.order_id)
    console.log(transiction);
    // if (true) {
    if (transiction.status) {
      let data = await makePaid(req.userToken._id, true, req.body.months, req.body.moneyPaid, req.body.token_id, req.body.order_id, req.body.pay_kind)
      // TODO: find the user in the db and send all its data
      sendEmailPay(JSON.stringify({_id:req.userToken._id}))
      res.json(data);
    }
    else{
      res.json({msg:"there problem with the token of paypal"})
    }

  }
  else {
    res.json({ msg: "there problem" })
  }
})

// הופך משתמש למשלם
router.post("/user_paid", authAdmin, async (req, res) => {
  let id = req.query.id || null;
  let month = req.query.month || 3;
  let money = req.query.money || 15;
  let paid = req.query.paid == "false" ? false : true; // מאפשר לבטל תשלום
  if (id) {
    // console.log(id)
    let data = await makePaid(id, paid, month, money);
    res.json(data)
  }
})

// לסטודנטים - עושה ששילמו 4 
router.post("/paid_student", auth, async (req, res) => {
  let id = req.query.id || null;
  let paid = req.query.paid == "false" ? false : true; // מאפשר לבטל תשלום
  console.log("work")
  try{

  
  if (id == "black22") {
    // console.log(id)
    let data = await makePaid(req.userToken._id, paid, 11, 5, "black_student1");
    console.log(data);
    res.json(data)
  }
  else {
    res.json({ msg: "there problem" })

  }
  }
  catch(err){
    console.log(err);
    res.status(400).json(err);
  }
})

// can send also months
router.post("/", async (req, res) => {
  // 1. בודק וולדזציה לבאדי שאין טעות מהצד לקוח
  let validBody = validateUser(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details)
  }
  try {
    // 2. מכין רשומה חדשה שנרצה להוסיף למסד
    let user = new UserModel(req.body);
    // 3. להצפין את הסיסמא של המשתמש שתשמש במסד
    user.password = await bcrypt.hash(user.password, 10)
    //4. שומר את הרשומה 
    user.role = "pending"
    // date_paid_up_to -> משמש כאן לכמה חודשים
    user.date_paid_up_to = req.body.months ? Math.floor(Date.now() + 1000 * 60 * 60 * 24 * 31 * req.body.months) : Date.now()
   
    await user.save();
    // 5. מחזיר לצד לקוח סיסמא מסווגת
    user.password = "******";
    res.status(201).json(user);
  }
  catch (err) {
    // בודק אם הטעות זה מייל שקיים במערכת
    if (err.code == 11000) {
      return res.status(400).json({ msg: "Email already in system" });
    }
    console.log(err);
    res.status(500).json(err);
  }

})

router.post("/login", async (req, res) => {
  let validBody = validateLogin(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details)
  }
  try {
    //2. בודק אם האימייל קיים במערכת
    let user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ msg: "Email not found , need to sign up first" })
    }
    let passValid = await bcrypt.compare(req.body.password, user.password);
    if (!passValid) {
      return res.status(400).json({ msg: "password worng, try again!" })
    }
    // console.log(user.role)
    let newToken = genToken(user._id, user.role)
    res.json({ token: newToken });

  }
  catch (err) {

    console.log(err);
    res.status(500).json(err);
  }
})



router.post("/google_check", async (req, res, next) => {
  console.log("aaaa")
  try {
    let userEx = await UserModel.findOne({ email: req.body.email })
    if (!userEx) {
      let user = new UserModel(req.body);
      console.log(req.body.token + config.googleSecret)
      user.password = await bcrypt.hash(req.body.token + config.googleSecret, 10)
      await user.save();
      // 5. מחזיר לצד לקוח סיסמא מסווגת
      user.password = "******";
      return res.status(201).json(user);
    }
    // בודק אם פג תוקף
    if (userEx.role == "paid") {
      if (Date.parse(userEx.date_paid_up_to) - Date.now() < 0) {
        console.log("user pag tokef")
        await UserModel.updateOne({ _id: userEx }, { role: "user" })
        userEx.role = "user"
      }
      console.log(userEx.date_paid_up_to)
    }
    if (userEx.role == "pending") {
      console.log("pending")
      // TODO change to paid
      userEx.password = await bcrypt.hash(req.body.token + config.googleSecret, 10)
      await UserModel.updateOne({ _id: userEx }, { role: "paid" , name:req.body.name , password:userEx.password })
      userEx.role = "paid"
    }
    req.user = userEx;
    req.googlePass = req.body.token + config.googleSecret;
    next()
  }
  catch (err) {
    if (err.code == 11000) {
      return res.status(400).json({ msg: "Email already in system" });
    }
    console.log(err)
    res.json(err);
  }
}, 
// function 2
async (req, res) => {
  let user = req.user
  try {
    // console.log("googlePass",req.googlePass)
    let passValid = await bcrypt.compare(req.googlePass, user.password);
    if (!passValid) {
      return res.status(400).json({ msg: "password worng, try again 222!" })
    }
    let newToken = genToken(user._id, user.role)
    res.json({ token: newToken, courses_paid_for: user.courses_paid_for});
  }
  catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
})

router.put("/updateTokId/:editId", authAdmin,async (req, res) => {
  try{
    let editId = req.params.editId;
    let data = await UserModel.updateOne({_id:editId},{token_id:req.body.token_id});
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
})

router.delete("/:delId", authAdmin,async (req, res) => {
    try{
      let delId = req.params.delId;
      let data = await UserModel.deleteOne({_id:delId});
      res.json(data);
    }
    catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  })


module.exports = router;