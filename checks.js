"use strict";

var L = require("library");

var passwordsDictionaryString = require("./passwords");
var passwordsDictionary = passwordsDictionaryString[0].split(",");

var patternChecks = require("./checks-list");

var patternCheck = function (message, pattern) {
    var regex = new RegExp(pattern);

    return function (password) {
        return regex.test(password) ? message : false;
    };
};

var top10k = function (password) {
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

module.exports = [top10k].concat(L.map(patternCheck, patternChecks));
