require("dotenv").config();
var envToken = process.env.SECRET_KEY;

var request = require("request");
// var token = require("./secrets.js");
var fs = require("fs");

var repoOwner = process.argv[2];
var repoName = process.argv[3];

console.log("Welcome to the GitHub Avatar Downloader!");

function getRepoContributors(repoOwner, repoName, cb) {
    // check if repoOwner and repoName are undefined no request made program terminates
    if (repoOwner == undefined || repoName == undefined) {
        console.log(
            "No repo owner or repo name entered. No request will be made"
        );
        return;
    }
    var options = {
        url:
            "https://api.github.com/repos/" +
            repoOwner +
            "/" +
            repoName +
            "/contributors",
        headers: {
            "User-Agent": "teeaaspoon",
            Authorization: "token " + envToken
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
    //check if filePath ./avatars exists if it doesnt create the folder
    if (fs.existsSync("./avatars")) {
    } else {
        fs.mkdir("./avatars", function(err) {
            if (err) {
                console.log("failed to create directory", err);
            }
        });
    }

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
