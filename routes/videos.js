const express = require("express");
const {auth} = require("../middlewares/auth");
const { addVideoToCourse, checkCourseId, delIdVideoFromCourse } = require("../middlewares/videos_courses");
const {validateVideo,VideoModel, generateShortId, validateSubject} = require("../models/videoModel");


const router = express.Router();

router.get("/", async(req,res) => {
  try{
  let searchQ = req.query.s || "bs";
  searchQ = new RegExp(searchQ,"i")
  let data = await VideoModel.find({title:searchQ}).limit(20)
  res.json(data)
  }
  catch(err){ res.status(500).json(err)}
})

router.get("/newVideos", async(req,res) => {
  try{
  
  let data = await VideoModel.find({subject:false}).limit(8).sort({_id:-1})
  res.json(data)
  }
  catch(err){ res.status(500).json(err)}
})

router.get("/single/:idVideo", async(req,res) => {
  let idVideo = req.params.idVideo;
  try{
  let data = await VideoModel.findOne({_id:idVideo})
  res.json(data)
  }
  catch(err){ res.status(500).json(err)}
})

router.post("/group/", async(req,res) => {
  
  try{
    if(req.body.videos_ar){
      let data = await VideoModel.find({_id:{$in:req.body.videos_ar}},{title:1,course_id:1,short_id:1,url_video:1}).limit(15);
      res.json(data)    
    }
    else{
      return res.status(401).json({msg:"error need to send viedos_ar"})
    }
    
  
  }
  catch(err){ res.status(500).json(err)}
})


router.get("/byCourse/:idCourse", async(req,res) => {
  // האיי די המקוצר של הקורס
  let idCourse = req.params.idCourse;
  try{
  let data = await VideoModel.find({course_id:idCourse})
  .sort({position:1})
  res.json(data)
  }
  catch(err){ res.status(500).json(err)}
})

router.post("/", auth , async(req,res) => {
  let validBody = validateVideo(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details)
  }
  try{

    let video = new VideoModel(req.body);
    video.short_id = await generateShortId()
    await checkCourseId(video.course_id) 
    video.user_id = req.userToken._id;
    // create short_id
    await video.save();
    // מכניס אותו למערך של הקורס 
    let data1 = await addVideoToCourse(video.course_id,video.short_id)
    return res.status(201).json(video)
  }
  catch(err){
    if(err.code == 11000){
      return res.status(401).json({msg:"short_id in system pick another"})
    }
    console.log(err);
    res.status(500).json(err);
  }
})

router.put("/:idEdit", auth , async(req,res) => {
  let validBody = validateVideo(req.body);
  if(validBody.error){
    
    return res.status(400).json(validBody.error.details)
    
  }
  try{
    let idEdit = req.params.idEdit
    let data = await VideoModel.updateOne({_id:idEdit, user_id:req.userToken._id},req.body)
    res.json(data);
  }
  catch(err){
    console.log(err);  res.status(500).json(err);
  }
})
// ישמש גם למחיקת נושאים SUBJECT & VIDEO 
router.delete("/:idDel", auth , async(req,res) => {
  try{
    let idDel = req.params.idDel;
    await delIdVideoFromCourse(idDel);
    let data = await VideoModel.deleteOne({_id:idDel, user_id:req.userToken._id});
    // await delIdVideoFromCourse()
    res.json(data);
  }
  catch(err){
    console.log(err);  res.status(500).json(err);
  }
})

// #################### SUBJECT ################
// subject - קיים בקולקשן של הוידיאו
router.post("/subject", auth , async(req,res) => {
  let validBody = validateSubject(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details)
  }
  try{
    let video = new VideoModel(req.body);
    video.user_id = req.userToken._id;
    // create short_id
    video.short_id = await generateShortId() 
    video.subject = true;
    await video.save();

    return res.status(201).json(video)
  }
  catch(err){
    if(err.code == 11000){
      return res.status(401).json({msg:"short_id in system pick another"})
    }
    console.log(err);
    res.status(500).json(err);
  }
})

router.put("/subject/:idEdit", auth , async(req,res) => {
  let validBody = validateSubject(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details)
  }
  try{
    let idEdit = req.params.idEdit
    let data = await VideoModel.updateOne({_id:idEdit, user_id:req.userToken._id},req.body)
    res.json(data);
  }
  catch(err){
    console.log(err);  res.status(500).json(err);
  }
})




module.exports = router;