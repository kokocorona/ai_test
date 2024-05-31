const mongoose = require("mongoose");
const Joi = require("joi");
let schema = new mongoose.Schema(
  {
    name: String,
    info: String,
    category: {
      type:String, ref:"categories"
    },
    img_url: String,
    price: Number,
    // ref - הקשר של המאפיין עם קולקן אחר כפורג'ן קיי
    // חייבים להוסיף כדי שנוכל לבצע פעול פופלט שמזכירה את ג'ויין ב אס קיו אל
    user_id: {
      type:"ObjectId", ref:"users"
    },
  },
  { timestamps: true }
);
exports.ToyModel = mongoose.model("toys", schema);
exports.validateToy = (_reqBody) => {
  let joiSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    info: Joi.string().min(2).max(400).required(),
    category: Joi.string().min(2).max(100).required(),
    img_url: Joi.string().min(2).max(400).allow(null, ""),
    price: Joi.number().min(1).max(9999).required(),
  });
  return joiSchema.validate(_reqBody);
};
