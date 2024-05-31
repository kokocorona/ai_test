const mongoose = require("mongoose");
const Joi = require("joi");

let schema = new mongoose.Schema({
  name: String,
  category_id: String,
  img_url: String,
},{timestamps:true})
exports.CategoryModel = mongoose.model("categories", schema)

exports.validateCategory = (_reqBody) => {
  let joiSchema = Joi.object({
    name: Joi.string().min(2).max(200).required(),
    category_id: Joi.string().min(2).max(100).required(),
    img_url: Joi.string().min(2).max(400).allow(null, ""),
  })
  return joiSchema.validate(_reqBody)
}