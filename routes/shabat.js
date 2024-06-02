const express = require("express");
const { MiscModel } = require("../models/miscModel");
const router = express.Router();

router.get("/", async(req,res) => {
  try{
    let data = await MiscModel.findOne({if_shabat:"yes"});
    console.log(data);
    res.json(data);
  }
  catch(err){

    res.json({if_shabat:"no"})
  }
})
// ?status="yes" or "no"
router.get("/change", async(req,res) => {
  try{
    let data = await MiscModel.updateOne({_id:"626bc07348790f2e112d8746"},{if_shabat:req.query.status})
    console.log(data);
    res.json(data);
  }
  catch(err){

    res.json({if_shabat:"no ,err"})
  }
})

module.exports = router;