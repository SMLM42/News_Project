const db = require('../models/Article');
const axios = require("axios")
const cheerio = require("cheerio");
exports.test = function (req, res) {
    res.send('Greetings from the Test controller!');
};
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

            if ((result.title != "") && (result.summary != "") && (result.link != undefined)) {
                db.create(result)
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
    db.find({})
        .then(function (dbArticle) {
            // If we were able to successfully find Articles, send them back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
}