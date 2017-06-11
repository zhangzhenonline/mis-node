const express = require('express')
const path = require('path')
const fs = require('fs')
const mongoose = require('mongoose')
const velocity = require('velocityjs');
const bodyParser = require('body-parser');
const _ = require('underscore')   //新数据替换老数据
const port = process.env.PORT || 4000

const app = express()

const Movie = require('./modles/movie')
const db = mongoose.connect('mongodb://localhost:27017/mis-node')
db.connection.on("open", ()=>{
  console.log("数据库连接成功")
})
db.connection.on("error", (error)=>{
  console.log("数据库连接失败"+ error)
})
app.use(express.static(path.join(__dirname, '/resources')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// 模板引擎
app.set('views', path.join(__dirname, '/resources/'))
app.set('view engine', 'html');
app.engine('html',(path,options,fn) => {
let template = fs.readFileSync(path).toString();
let macros = {
  parse: function(file) {
  let template = fs.readFileSync(__dirname + '/resources/' + file).toString()
  return this.eval(template);
  }
}
try{
  fn(null, velocity.render(template, options, macros))
}catch(err){
  console.log(err);
  fn(err)
}

});

//路由 首页
app.get('/', (req, res) => {
   res.render('views/base/index', {
     title: '首页'
   })
})
// 详情页
app.get('/movie/:id', (req, res) => {
   let id = req.params.id;
   Movie.findById(id, (err, data) => {
     if(err){
       console.log(err)
     }
     res.render('detail', {
       title: '详情页',
       movies: data
     })
   })
})
// 后台登录页
app.get('/admin/movie', (req, res) => {
  Movie.fetch((err, data) => {
    if(err){
      console.log(err)
    }
    res.render('detail', {
      title: '详情页',
      movies: data
    })
  })
})
// 列表页
app.get('/admin/list', (req, res) => {
   res.render('list', {
     title: '列表页'
   })
})
// post 提交
app.post('/admin/movie/new', (req, res) => {
  let id = req.body.id;
  let movieObj = req.body;
  let _movie
   if(id !== 'undefined'){
     Movie.findById(id ,(err, data) => {
        if(err){
          console.log(err)
        }
        // 将查询的放在第一个参数上， 第二个参数是post参数上
        _movie = _.extend(movie, movieObj)
        _movie.save((err, data) => {
          if(err){
            console.log(err)
          }
          res.redirect('/movie' + movie._id)
        })
     })
   }
   else{
     console.log("--------------")
       _movie = new Movie({
         name: movieObj.name,
         title: movieObj.title,
         year: movieObj.year,
       })
       console.log(_movie);
       _movie.save((err, data) => {
         if(err){
           console.log(err)
         }
         console.log(data);
         res.redirect('/movie' + movie._id)
       })
   }

})
//端口号
app.listen(port,() => {
  console.log('start on port '  + port)
});
