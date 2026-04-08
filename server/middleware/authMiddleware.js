const express = require("express")
const router = express.Router()

const Application = require("../models/Application")
console.log("Application Routes Loaded")  // 👈 MUST ADD


/* ================================
   APPLY SERVICE
================================ */

    
router.post("/apply", async (req,res)=>{

try{

console.log("Application API HIT")
console.log(req.body)

const {
userId,
service,
fullName,
dob,
gender,
fatherName,
motherName,
placeOfBirth
} = req.body

const newApplication = new Application({

userId,
service,
fullName,
dob,
gender,
fatherName,
motherName,
placeOfBirth,

timeline:[
{
step:"Application Submitted",
status:"completed",
date:new Date().toLocaleString()
},
{
step:"Document Verification",
status:"pending"
},
{
step:"Under Review",
status:"pending"
},
{
step:"Final Approval",
status:"pending"
}
]

})

await newApplication.save()

res.json({
message:"Application submitted successfully",
application:newApplication
})

}

catch(err){
res.status(500).json({error:err.message})
}

})


/* ================================
   GET USER APPLICATIONS
================================ */

router.get("/user/:userId", async (req,res)=>{
    console.log("Fetching applications for:", req.params.userId)

try{

const applications = await Application.find({
userId:req.params.userId
})

res.json(applications)

}

catch(err){

res.status(500).json({error:err.message})

}

})


/* ================================
   GET SINGLE APPLICATION
================================ */

router.get("/details/:id", async (req,res)=>{

try{

const application = await Application.findById(req.params.id)

res.json(application)

}

catch(err){

res.status(500).json({error:err.message})

}

})

// ===============================
// GET SINGLE APPLICATION
// ===============================

router.get("/:id", async (req, res) => {

try {

const app = await Application.findById(req.params.id)

if (!app) {
return res.status(404).json({ message: "Application not found" })
}

res.json(app)

} catch (err) {
res.status(500).json({ error: err.message })
}

})
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ msg: "No token" });

  const decoded = jwt.verify(token, "secretKey");

  req.user = decoded;
  next();
};


module.exports = router