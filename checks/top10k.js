"use strict";

var L = require("hsimp-library");

var passwordsDictionaryString = require("./top10k.json");
var passwordsDictionary = passwordsDictionaryString[0].split(",");

module.exports = function (password) {
    var rank;

    password = password.toLowerCase();

    L.forEach(function (checking, index) {
        if (checking === password) {
            rank = Math.ceil((index + 1) / 5) * 5;
            return false;
        }
    }, passwordsDictionary);

    if (rank) {
        return {
            level: "insecure",
            id: "top10k",
            value: rank
        };
    } else {
        return false;
    }
};
