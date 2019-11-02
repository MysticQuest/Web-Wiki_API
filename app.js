//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//---------------------------DB SETUP---------------------------------

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
}

mongoose.connect("mongodb://localhost:27017/WikiDB", options);

const articleSchema = {
  title: {
    type: String,
    required: [true, "Error - Blank Entry"]
  },
  content: {
    type: String,
    required: [true, "Error - Blank Entry"]
  }
};

const Article = mongoose.model("Article", articleSchema);



//------------------------------------ROUTING-----------------------------

//chaining routes

app.route("/articles")
  .get(function(req, res) {
    Article.find(function(err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })
  .post(function(req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.title
    });
    newArticle.save(function(err) {
      if (!err) {
        res.send("Added new article!")
      } else {
        res.send(err);
      }
    });
  })
  .delete(function(req, res) {
    Article.deleteMany({}, function(err) {
      if (!err) {
        res.send("Deleted!")
      } else {
        res.send(err);
      }
    });
  });




app.listen(3000, function() {
  console.log("Server started on port 3000");
});