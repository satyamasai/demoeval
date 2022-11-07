const express = require("express");
const { userController } = require("./Routes/user.route");
const app = express();
const {connection} = require(".//Config/db")
require("dotenv").config();
const {authentication} = require(".//Middlewares/authentication");
const { userModel } = require("./Models/user.model");
const { BMIModel } = require("./Models/BMI.model");
const cors= require("cors")
app.use(cors())
app.use(express.json());

app.get("/", (req, res) => {
  res.send("welcome to the app");
});

app.use("/user",userController);

app.get("/getprofile",authentication, async (req,res)=>{
        const {user_id} = req.body;
        const user = await userModel.findOne({_id:user_id})
      
const {name,email} = user
// console.log()
res.send({name,email})
         

})

app.post("/calculateBMI",authentication, async (req,res)=>{
       const {weight, height , user_id} = req.body;
       const height_in_m = Number(height)*0.3048
       const BMI  = Number(weight)/height_in_m**2

       const user_bmi = new BMIModel({
        height:height_in_m,
        weight,
        BMI,
        user_id


       })
       await user_bmi.save()
       res.send({BMI})     


})

app.get("/getCalculation",authentication, async (req,res)=>{
             const {user_id} = req.body;

             const all_bmi = await BMIModel.find({ user_id:user_id}) ;

             res.send({history:all_bmi})

})



app.listen(process.env.PORT, async() => {

    try{
         await connection
         console.log("database connected")
         console.log("listening on " + process.env.PORT);
    }catch(err){
        console.log("databse connecting failed" )
        console.log(err);
    }
});
