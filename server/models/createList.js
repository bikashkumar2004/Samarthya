const mongoose = require("mongoose");

const CreateList = new mongoose.Schema({
  Listname: { type: String, required: true },
  folder: { type: String, require: true },
});

module.exports=mongoose.model('CartList',CreateList)