const axios = require("axios");
const express = require("express");
require("dotenv").config();
const router = express.Router();

// הגדרת ראוטר של הרואט שנגדיר באפ
router.get("/",async(req,res) => {
  const q = req.query.q || "story about the city netanya";
  try{
    const resp = await axios({
      url:`https://api.cloudflare.com/client/v4/accounts/${process.env.APP_ID}/ai/run/@cf/meta/llama-2-7b-chat-int8`,
      method:"POST",
      data: JSON.stringify({"messages":[{"role":"system",
      "content":"You are a friendly assistant that helps write stories"},
      {"role":"user",
      "content":q}]}),
      headers:{
        "Authorization":`Bearer ${process.env.API_AI_KEY}`
      }
    })
    console.log(resp.data.result);
    // const data = JSON.parse(resp.data.result)
    res.json({q,...resp.data.result});
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
  // res.json({msg:"ai test"});
})

// הגדרת ראוטר של הרואט שנגדיר באפ
router.post("/image",async(req,res) => {
  try{
    const inputs = {
      image: [...new Uint8Array(req.files.foo.data)],
    };
    console.log(req.files.foo)
    console.log(inputs);

    const {data} = await axios({
      url:`https://api.cloudflare.com/client/v4/accounts/${process.env.APP_ID}/ai/run/@cf/microsoft/resnet-50`,
      method:"POST",
      data:inputs,
      headers:{
        "Authorization":`Bearer ${process.env.API_AI_KEY}`
      }
    })
    console.log(data);
    // console.log(resp.data.result);
    // const data = JSON.parse(resp.data.result)
    res.json(data.result);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
  // res.json({msg:"ai test"});
})


// export default
module.exports = router;