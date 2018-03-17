var express = require("express");
var mongojs = require("mongojs");
var request = require("request");
var cheerio = require("cheerio");

var app = express();

var databaseUrl = "scraper";
var collections = ["scrapedData"];

var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
    console.lod("Database Error:", error);
});

app.get("/", function(req, res) {
    res.send("hello world");
});

app.get("/all", function(req, res) {
    // find everything
    db.scrapedData.find({}, function(err, found) { //find({} = find everything 
        // docs is an array of all the documents in mycollection
        if (err) {
            console.log(err);
        } else {
            res.json(found);
        }
    });
});

//app.get going to use scrape route, then run this function-> we are making a request to "https:____.com" AND we want an error, a response request and (html = contents)
app.get("/scrape", function(req, res) {
	
    request("https://news.ycombinator.com/", function(error, response, html) {
        var $ = cheerio.load(html); // set $ to cheerio.load and insert html inside 

        $(".title").each(function(i, element) { //  //.text() will grab the text, so we're at title class-> this all says "go to title classes CHILDREN ("a link"), grab text from that tag and set that to variable title
            var title = $(this).children("a").text();
            var link = $(this).children("a").attr("href");

            if (title && link) { //if title and link exist --> save it into database 
                db.scrapedData.save({
                        title: title,
                        link: link
                    },
                    function(error, saved) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log(saved);
                        }
                    });
            }
        });
    });

    res.send("Scrape complete");

});





app.listen(3000, function() {
    console.log("App running on port 3000");
});