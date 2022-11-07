
const mongoose = require("mongoose");

const BMISchema = mongoose.Schema({
    BMI:{type:Number, required:true},
    height:{type:Number , required:true},
    weight:{type:Number, required :true},
    user_id:{type:String, required:true}
},{timestamps:true}) 

const BMIModel = mongoose.model("bmi" , BMISchema);

module.exports={
    BMIModel
}