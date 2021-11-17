const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
var _ = require('lodash');//_ is the lodash variable name

const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect('mongodb+srv://demo:vedant123@cluster0.smy48.mongodb.net/blogData', {useNewUrlParser: true });   //name of database id blogData



const homeStartingContent = "Create a blog and share your voice with the world in minutes! Also, below are the most trendy and latest blogs written by people all across the globe, so make sure to have a read 🥂";
const aboutContent = "We are a highly dedicated team of 1 person who has burnt the night oil to make this Blog Website for the users. We expect the users to maintain decorum and write sensible blogs. Though the creator of this website is an attention-seeker, he prefers to stay anonymous this time.";
const contactContent = "Contact details :";


let blogSchema = ({  //model of each blog
  title: String,
  content: String,
  notes:[String],
  noOfLikes:Number,
});

let Blog = mongoose.model("Blog",blogSchema);  // the database name is Blog




let reqTitle;


app.get("/", function(req, res){

  Blog.find({}, function(err, blogs){
    res.render("home", {startContent: homeStartingContent,blogs: blogs});
  });
});



app.get("/about",function(req,res){
  res.render('about',{aboutPagePara:aboutContent});
});

app.get("/contact",function(req,res){
  res.render('contact',{contactPagePara:contactContent});
});

app.get("/compose",function(req,res){
  res.render("compose");
});




app.post("/compose",function(req,res){
  let latestPost = new Blog({
    title: req.body.postTitle,
    content: req.body.postPost,
    noOfLikes : 0
  });

  latestPost.save(function(err){  //save latestPost
    if (!err){
        res.redirect("/");  //redirect to root route
    }
  });
});





app.get('/blogs/:postKiId', function (req, res) {  //dynamic url
  reqTitle = req.params.postKiId;  //req.params for dynamic url

  Blog.findOne({_id: reqTitle}, function(err, latestPost){
    res.render("post", {PostSeparateTitle: latestPost.title,PostSeparateContent: latestPost.content, PostSeparateNotes: latestPost.notes});
  });

});




app.post("/post",function(req,res){
  var lol = req.body.postNotes;
    Blog.findByIdAndUpdate(reqTitle, { $push: { notes: lol  } },
        function (err, docs) {
          if (err){
              console.log(err);
          }
          else{
              console.log("Updated User : ", docs);
          }
    });
  res.redirect("/");
});




app.post("/like",function(req,res){

  // var likeID = req.body.likeValue;
  // console.log(likeValue);
  Blog.findByIdAndUpdate(reqTitle, {$inc : {noOfLikes : 1}} ,
      function (err, docs) {
        if (err){
            console.log(err);
        }
        else{
            console.log("Updated User : ", docs);
        }
  });

  res.redirect("/");
});




let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() { //3000 for local host and process.env.PORT for heroku
  console.log("server started");
});
