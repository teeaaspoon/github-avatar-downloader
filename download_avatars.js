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

    // check if the dotenv file exists
    if (fs.existsSync("./.env")) {
        console.log("dotenv file exists");
    } else {
        console.log("could not find .env file. Program aborted");
        return;
    }

    // check if .env is missing information.
    if (envToken === undefined) {
        console.log(".env file is missing information: SECRET_KEY missing");
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
        // check if the owner or repo exists if doesnt exist statusCode will be 404
        // check if .envfile contains the correct credentials will statusCode will be 401 if wrong authorization code
        if (response["statusCode"] != 200) {
            console.log(
                "The repo does not exist or you're not authorized. Please enter a valid repoOwner and repoName"
            );
            return;
        }

        // parses the json to object
        var object = JSON.parse(body);
        // passes the parameters into callback
        cb(error, object);
    });
}

function downloadImageByURL(url, filePath) {
    // check if filePath ./avatars exists if it doesnt create the folder
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
    // console.log("Result:", result);
    result.forEach(function(element) {
        // console.log(element["login"]);
        // console.log(element["avatar_url"]);
        var filePath = "./avatars/" + element["login"] + ".jpg";
        downloadImageByURL(element["avatar_url"], filePath);
    });
});
