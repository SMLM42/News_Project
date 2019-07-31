const db = require('../models');
const axios = require("axios")
const cheerio = require("cheerio");
exports.home = function (req, res) {
    res.render('index')
}
exports.scrape = function (req, res) {
    console.log("Scraping")
    axios.get("https://medium.com/topic/popular").then(function (response) {

        const $ = cheerio.load(response.data);

        $(".dr").each(function (i, element) {
            let result = {};

            result.title = $(element).children("h3").text();

            result.summary = $(element).children("div").children("p").text();

            result.link = $(element).children("div").children("p").children("a").attr("href");
            let link = result.link

            if (link != undefined) {
                // console.log(link)
                let linkTest = link.substring(0, 1)
                if (linkTest === "/") {
                    result.link = ("https://medium.com" + link)
                }
                if ((result.title != "") && (result.summary != "")) {

                    db.Article.findOne({ title: result.title })
                        .then(function (check) {
                            // console.log(a)
                            if (check === null) {
                                console.log("made it!!")
                                db.Article.create(result)
                                    .then(function (dbArticle) {
                                        console.log(dbArticle);
                                        console.log(i)
                                    })
                                    .catch(function (err) {
                                        console.log(err);
                                    });
                            }
                        }).catch(function (err) {
                            console.log(err)
                        })
                }
            }
            // result.comment = { title: "bleh", body: "meh" }

        });
        res.send("Finished Scraping, please go to home page to see results");
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
        // console.log(res)
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
