const express = require("express");
const { ToyModel, validateToy } = require("../models/toyModel");
const { auth } = require("../middlewares/auth");
const router = express.Router();

router.get("/", async (req, res) => {
  // Math.min - מחזיר את המספר הקטן מ2 המספרים בפרמטרים
  // limit - משתנה שמגביל את כמות הרשומות שיחזרו לצד לקוח
  const limit = Math.min(req.query.limit, 20) || 5;
  // || - אם הראשון לא נכון ייקח את הערך השני
  // ידאג על כמה רשומות לדלג
  const skip = req.query.skip || 0;
  // משתנה שיקבע לפי איזה מאפיין נמיין את המידע מהמסד
  const sort = req.query.sort || "_id";
  // משתנה שדואג אם למיין מהקטן לגדול או מהגדול לקטן
  const reverse = req.query.reverse == "yes" ? 1 : -1;



  try {
    let findFilter = {};
    // בודק אם נשלח קטגוריה ספציפית של מוצרים שנרצה לשלוף רק
    if(req.query.category){
      findFilter.category = req.query.category
    }
    // בודק אם יש חיפוש
    if(req.query.s){
      let queryExp = new RegExp(req.query.s,"i");
      findFilter.$or = [{name:queryExp},{info:queryExp}]
      // findFilter.name = queryExp
      // findFilter.info = queryExp
    }
    // SELECT * FROM wolt ORDER BY price ASC LIMIT skip,limit;
    const data = await ToyModel.find(findFilter)
      .limit(limit)
      .skip(skip)
      // sort - מיון , נותנים מאפיין/עמודה ואחד או מינוס אחד
      // אחד מייצג אסינדינג מהקטן לגדול ומינוס 1 הפוך
      // [] = יחזיר את הערך של הסורט ולא ישתמש בסורט כמאפיין
      .sort({ [sort]: reverse });
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});

router.get("/single/:id", async (req, res) => {
  try {
    const id = req.params.id;
    let data = await ToyModel.findOne({ _id: id });
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});

// דוגמא כיצד לשלוף מידע בשיטת הפופליט
// הדומה לג'וין כך שישלף מידע מקולקשינים אחרים
// שקשורים לאותו קולקשן
router.get("/pop", async(req,res) => {
  try{
    const data = await ToyModel
    .find({})
    .sort({_id:-1})
    // populate - ישלוף את כל המידע לפי האיי
    // די של המשתמש מהקולקשן המקורי של היוזר
    // .populate("user_id")
    // path - שם של הקולקשן
    // select - שמות של מאפיינים שנרצה לשלוף , מפרידים 
    // אותם עם רווחים
    .populate({path:"user_id",select:"name email role"})
    // foreignField - במידה והמאפיין עם הפורג'יין קיי
    // לא קשור למאפיין איי די בקולקשן המקורי , נוכל להכווין את מונגו
    // לפי איזה מאפיין בקולקשן שאנו מקושרים אליו הוא מחובר
    // 
    .populate({path:"category",select:"name",foreignField:"category_id"})
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})

// שליפת מספר רשומות לפי האיי דיס שלהם 
router.post("/group",async(req,res) => {
  try{
    // const group_ar = ["660d7d02543f0e676e360d00","660d7ea5f5c03315f92fac47","660d7eccf5c03315f92fac4b"]
    if(req.body.group_ar){
      const group_ar = req.body.group_ar;
      // $in - מאפשר לשלוף מספר רשומות לפי מערך של איי דים של מוצרים שנעביר בבאדי
      const data = await ToyModel.find({_id:{$in:group_ar}})
      res.json(data);
    }
    else{
      res.status(400).json({err:"You need to send prop group_ar in the body"})
    }
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})

router.post("/", auth, async (req, res) => {
  let validBody = validateToy(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let toy = new ToyModel(req.body);
    toy.user_id = req.tokenData._id;
    await toy.save();
    res.json(toy);
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});

router.put("/:id", async (req, res) => {
  let validBody = validateToy(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let id = req.params.id;
    let data = await ToyModel.updateOne({ _id: id }, req.body);
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let data = await ToyModel.deleteOne({ _id: id });
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});

module.exports = router;
