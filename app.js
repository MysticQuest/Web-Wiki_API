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
};

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

//chaining routes for articles

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
        res.send("Added new article!");
      } else {
        res.send(err);
      }
    });
  })
  .delete(function(req, res) {
    Article.deleteMany({}, function(err) {
      if (!err) {
        res.send("Deleted!");
      } else {
        res.send(err);
      }
    });
  });

//chaining routes for specific articles

app.route("/articles/:articleTitle")

  .get(function(req, res) {
    Article.findOne({
      title: req.params.articleTitle
    }, function(err, foundArticle) {
      if (foundArticle) {
        res.send(foundArticle);
      } else {
        res.send("No articles matching that title were found");
      }
    });
  })
  .put(function(req, res) {
    Article.update({
      title: req.params.articleTitle
    }, {
      title: req.body.title,
      content: req.body.content
    }, {
      overwrite: true
    }, function(err) {
      if (!err) {
        res.send("Updated article!");
      }
    });
  })
  .patch(function(req, res) {
    Article.update({
      title: req.params.articleTitle
    }, {
      $set: req.body
    }, function(err) {
      if (!err) {
        res.send("Updated article!");
      } else {
        res.send(err);
      }
    });
  })
  .delete(function(req, res) {
    Article.deleteOne({
      title: req.params.articleTitle
    }, function(err) {
      if (!err) {
        res.send("Deleted article...");
      } else {
        res.send(err);
      }
    });
  });



app.listen(3000, function() {
  console.log("Server started on port 3000");
});