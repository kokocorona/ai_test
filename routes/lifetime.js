// Route for add 

const express = require("express");
const { authAdmin } = require("../middlewares/auth");
const { validateUsersLifeTimeCourse, UserModel } = require("../models/userModel");
const router = express.Router();

router.get("/", (req,res) => {
  res.json({msg:"life time work"})
})


router.post("/",authAdmin,async(req,res) => {
  let validBody = validateUsersLifeTimeCourse(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details)
  }
  try{
    const data = await UserModel.updateOne({_id:req.body.user_id},{courses_paid_for:req.body.courses_paid_for});
    res.json({msg:"success",data})
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})

module.exports = router;