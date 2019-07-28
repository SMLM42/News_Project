const db = require('../models');
const axios = require("axios")
const cheerio = require("cheerio");
exports.home = function (req, res) {
    res.render('index')
}
exports.scrape = function (req, res) {
    console.log("a")
    axios.get("https://medium.com/topic/popular").then(function (response) {

        const $ = cheerio.load(response.data);

        $(".dt").each(function (i, element) {
            let result = {};

            result.title = $(element).children("h3").text();

            result.summary = $(element).children("div").children("p").text();

            result.link = $(element).children("div").children("p").children("a").attr("href");

            // result.comment = { title: "bleh", body: "meh" }
            if ((result.title != "") && (result.summary != "") && (result.link != undefined)) {
                db.Article.create(result)
                    .then(function (dbArticle) {
                        console.log(dbArticle);
                        console.log(i)
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
            }
        });
    });

}
exports.articles = function (req, res) {
    db.Article.find({})
        .then(function (dbArticle) {
            // console.log(dbArticle)
            // If we were able to successfully find Articles, send them back to the client
            // res.json(dbArticle);
            res.json({
                status: 200,
                data: dbArticle
            });
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
}
exports.loadComments = function (req, res) {
    db.Article.findOne({ _id: req.params.id })
        // ..and populate all of the notes associated with it
        .populate("comment")
        .then(function (dbArticle) {
            // If we were able to successfully find an Article with the given id, send it back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
}
exports.postComment = function (req, res) {

    db.Comment.create(req.body)
        .then(function (dbComment) {
            console.log(req.body)
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { comment: dbComment._id }, { new: true });
        })
        .then(function (dbArticle) {
            // If we were able to successfully update an Article, send it back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });

}