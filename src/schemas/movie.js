//创建模式
let mongoose = require("mongoose");
let MovieSchema = new.mongoose.Schema({
  name: String,
  title: String,
  year: Number,
  meta: {
    createAt: {
      type: Date，
      default: Date.now()
    },
    updateAt: {
      type: Date，
      default: Date.now()
    }
  }
})
//每一保存一条数据，更新一个时间
MovieSchema.pre('save', (next)=>{
  if(this.isNew) {
    this.meta.createAt = this.meta.updateAt =  Date.now()
  }else{
    this.meta.updateAt =  Date.now()
  }
  next()
})
MovieSchema.statics = {
  fetch: (cb) => {
    return this
        .find({})
        .sort('meta.updateAt')
        exec(cb)
  }
  findById: (id,cb) => {
    return this
        .findOne({_id: id})
        exec(cb)
  }
}
module.exports = MovieSchema
