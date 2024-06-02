const express = require("express");
const {CourseModel,validateCourse} = require("../models/courseModel");
const {auth} = require("../middlewares/auth");
const router = express.Router();

router.get("/", async(req,res) => {
  let perPage = req.query.perPage || 20;
  let page = req.query.page || 1;
  let sort = req.query.sort || "position";
  try{
    let data = await CourseModel.find({}).
    limit(perPage)
    .skip((page-1) * perPage)
    .sort({[sort]:1});
    res.json(data);

  }
  catch(err){res.status(500).json(err)}
})

router.get("/single/:id" ,  async(req,res) => {
  let id = req.params.id;
  try{
    let data
    if(id.length < 7){
      data = await CourseModel.findOne({short_id:id});
    }
    else{
       data = await CourseModel.findOne({_id:id});
    }
    res.json(data);
  }
  catch(err){res.status(500).json(err)}
})

router.get("/myCourses",auth, async(req,res) => {
  let perPage = req.query.perPage || 20;
  let page = req.query.page || 1;
  let sort = req.query.sort || "position";
  try{
    let data = await CourseModel.find({user_id:req.userToken._id}).
    limit(perPage)
    .skip((page-1) * perPage)
    .sort({[sort]:1})
    res.json(data)

  }
  catch(err){res.status(500).json(err)}
})

router.post("/",auth, async(req,res) => {
  let validBody = validateCourse(req.body);
  if(validBody.error){
    console.log(validBody.error.details)
    return res.status(400).json(validBody.error.details)
  }
  try{
    let course = new CourseModel(req.body);
    course.user_id = req.userToken._id;
    await course.save();

    return res.status(201).json(course)
  }
  catch(err){
    if(err.code == 11000){
      return res.status(401).json({msg:"short_id in system pick another"})
    }
    console.log(err);
    res.status(500).json(err);
  }
});

router.put("/:idEdit",auth, async(req,res) => {
  let validBody = validateCourse(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details)
  }
  try{
    let idEdit = req.params.idEdit
    let data = await CourseModel.updateOne({_id:idEdit, user_id:req.userToken._id},req.body)
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(500).json(err);
  }
})

// מעדכן את כל הרשומה
router.patch("/:idEdit",auth, async(req,res) => {
  if(!req.body.videos_sort?.length > 0){
    return res.status(400).json({msg:"you must send array if videoSort"})
  }
  try{
    let idEdit = req.params.idEdit
    let data = await CourseModel.updateOne({_id:idEdit, user_id:req.userToken._id},req.body)
    res.json(data);
    // res.json({msg:"all ok"})
  }
  catch(err){
    console.log(err);
    res.status(500).json(err);
  }
})






router.delete("/:idDel",auth, async(req,res) => {
  
  try{
    let idDel = req.params.idDel;
    let data = await CourseModel.deleteOne({_id:idDel, user_id:req.userToken._id})
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(500).json(err);
  }
})

module.exports = router;


/*

{
    "title":"ג'אווה סקריפט בסיס - תרגולים",
    "info":"קורס הבסיס של JS שיתן לכם לתרגל יחד עם לימוד עונה 3 באתר",
    "author":"עופר שלי - מרצה מנוסה עם מעל 15 שנות וותק בפיתוח וניהול פרוייקטים ומעל 10 שנים בתחום ההדרכה",
    "skill_needed":"HTML + CSS , וידע בסיס ב JS עונה 3 באתר מאנקיס",
    "img_url":"",
    "price":250,
    "short_id":"991"
}

*/