const { Router } = require("express");
const { userModel } = require("../Models/user.model");
const userController = Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

// ----------USER SIGNUP---------------------//
userController.post("/signup", async (req, res) => {
  const { email, password ,name} = req.body;
  const existing_user = await userModel.findOne({ email });
  if (existing_user) {
    res.send("user already exist")
    return;
  }
  bcrypt.hash(password, 4, async function (err, hash) {
    if (err) {
      res.send({"msg":"signup failed ..please try again.."});
    } else {
      // console.log("i am here");
      const new_user = new userModel({
        email: email,
        password: hash,
        name
      });

      await new_user.save();
      res.send({msg:"signup succesfull.."});
    }
  });
});


// ---------------USER LOGIN-----------------//

userController.post("/login", async (req, res) => {
    const {email, password} = req.body

    const user = await userModel.findOne({email})

    const hashed_password = user.password;

    const user_id = user._id;
    console.log(user)
    console.log(user_id)
    bcrypt.compare(password, hashed_password, function(err, result) {
          if(err){
            res.send({"msg" : "Something went wrong, try again later"})
          }
          if(result){
            const token = jwt.sign({user_id}, process.env.SECRET);  
            res.send({message : "Login successfull", token})
          }
          else{
            res.send({"msg" : "Login failed"})
          }
    });
})




module.exports = {
  userController,
};
