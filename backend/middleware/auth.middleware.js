const tokenBlackListModel = require('../model/blacklist.model');
const userMOdel =require('../model/user.model');
const jwt =require('jsonwebtoken')


exports.postauthMiddleware = async (req,res,next) =>{
  const token =req.cookies.token|| req.headers.authorization?.split(" ")[1]

  if(!token){
    return res.status(401).json({
      message:"unauthorized acces ,token is missing"
    })
  }
  const isBlacklisted = await tokenBlackListModel.findOne({token})
  if(isBlacklisted){
    return res.status(401).json({
      message:"Unauthozired access ,token is ivailad"
    })
  }
  try{
    const decode = jwt.verify(token,process.env.JWT_SECRET)
    const user =await userMOdel.findById(decode.userId)

    req.user =user 
    return next()
  }catch(err){
    return res.status(401).json({
      message:"unauthorized access ,token is invaild"
    })
  }
}

exports.adminMiddleware = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized: user not found"
      });
    }

    if (!req.user.isAdmin) {
      return res.status(403).json({
        message: "Admin only access ❌"
      });
    }

    next();

  } catch (err) {
    return res.status(500).json({
      message: "Admin middleware error"
    });
  }
};