const mongoose =require('mongoose')

const tokenBlackListSchema =new mongoose.Schema({
  token:{
    type:String,
    required:[true,"token is required to blacklist"],
    uniquie:[true,"token is already blacklisted "]
  }
},{
  timestamps:true
})

tokenBlackListSchema.index({createdAt:1},{
  expireAfterSeconds:60*60*24*3
})
const tokenBlackListModel =mongoose.model("tokenblacklist",tokenBlackListSchema)

module.exports =tokenBlackListModel;