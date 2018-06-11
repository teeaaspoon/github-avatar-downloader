var request = require("request");
var token = require("./secrets.js");

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
        cb(error, body);
    });
}

getRepoContributors("jquery", "jquery", function(err, result) {
    console.log("Errors:", err);
    console.log("Result:", result);
});
