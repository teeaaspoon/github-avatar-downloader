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
        var object = JSON.parse(body);
        cb(error, object);
    });
}

getRepoContributors("jquery", "jquery", function(err, result) {
    console.log("Errors:", err);
    console.log("Result:", result);
    result.forEach(function(element) {
        console.log(element["avatar_url"]);
    });
});
