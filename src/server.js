const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const _ = require('underscore')   //新数据替换老数据
const port = process.env.PORT || 4000 ;
const app = express();
const Movie = require('./modles/movie')
mongoose.connect('mongoose://localhost/mis-node')
app.use(express.static(path.join(__dirname,'public')));
// 模板引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').__express);

//路由 首页
app.get('/', (req, res) => {
   res.render('index', {
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
       title: '详情页'，
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
      title: '详情页'，
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
  let id = req.body.movie._id;
  let movieObj = req.body.movies;
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
       _movie = new Movie({
         name: movieObj.name,
         title: movieObj.title,
         year: movieObj.year,
       })
       _movie.save((err, data) => {
         if(err){
           console.log(err)
         }
         res.redirect('/movie' + movie._id)
       })
   }

})
//端口号
app.listen(port,() => {
  console.log('start on port '  + port)
});
