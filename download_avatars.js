var request = require("request");
var token = require("./secrets.js");
var fs = require("fs");

var repoOwner = process.argv[2];
var repoName = process.argv[3];

console.log("Welcome to the GitHub Avatar Downloader!");

function getRepoContributors(repoOwner, repoName, cb) {
    var options = {
        url:
            "https://api.github.com/repos/" +
            repoOwner +
            "/" +
            repoName +
            "/contributors",
        headers: {
            "User-Agent": "teeaaspoon",
            Authorization: "token " + token["GITHUB_TOKEN"]
        }
    };

    request(options, function(error, response, body) {
        // parses the json to object
        var object = JSON.parse(body);
        // passes the parameters into callback
        cb(error, object);
    });
}

function downloadImageByURL(url, filePath) {
    request
        .get(url)
        .on("error", function(err) {
            throw err;
        })
        .pipe(fs.createWriteStream(filePath));
}

getRepoContributors(repoOwner, repoName, function(err, result) {
    console.log("Errors:", err);
    console.log("Result:", result);
    result.forEach(function(element) {
        console.log(element["login"]);
        console.log(element["avatar_url"]);
        var filePath = "./avatars/" + element["login"] + ".jpg";
        downloadImageByURL(element["avatar_url"], filePath);
    });
});
