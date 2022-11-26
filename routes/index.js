var express = require('express');
const upload = require('./multer');
const { v4: uuidv4 } = require('uuid');
const fs=require('fs');
const path=require('path');
var router = express.Router();

let LOCAL_DB=[]
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('show', { cards: LOCAL_DB});
});

router.get('/add', function(req, res, next) {
  res.render('add', { title: 'Express' });
});

router.post('/add', function(req, res, next) {
  upload(req,res, function (err) {
    if(err) res.send(err)
    const newImage={
      title: req.body.title,
      author: req.body.author,
      image: req.file.filename,
      id: uuidv4()
    }
    LOCAL_DB.push(newImage)
    res.redirect('/')
  })
});

router.get('/update/:id', function(req, res, next) {
  const id=req.params.id;
  const filtereddata=LOCAL_DB.filter(function(d){
    if(id==d.id){
      return true
    }
  })
  res.render("update",{data: filtereddata})
});

router.get('/delete/:id', function(req, res, next) {
  const id=req.params.id;
  const idx=LOCAL_DB.findIndex(function(d){
    if(d.id==id){return true}
  })
  fs.unlinkSync(path.join(__dirname,"..","public","uploads",LOCAL_DB[idx].image))
  const filtereddata=LOCAL_DB.filter(function(d){
    if(id!=d.id){
      return true
    }
  })
  LOCAL_DB=filtereddata;
  res.redirect("/")
});

router.post('/update/:id', function(req, res, next) {
  upload(req,res,function (err){
if (err) res.send(err)
const id=req.params.id
const updatedData={
  title: req.body.title,
  author: req.body.author,
  image: req.body.oldgallery,
  id: id
}
const idx=LOCAL_DB.findIndex(function(d){
  if(d.id==id){return true}})
if (req.file) { fs.unlinkSync(path.join(__dirname, ".." , "public" , "uploads", req.body.oldgallery));
  updatedData.image = req.file.filename;
}


 LOCAL_DB[idx]={...LOCAL_DB[idx],...updatedData}   
 res.render('show',{ cards:LOCAL_DB})
    })

});




module.exports = router;
