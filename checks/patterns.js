"use strict";

var L = require("hsimp-library");

var patternChecks = require("./patterns.json");

var patternCheck = function (message, pattern) {
    var regex = new RegExp(pattern);

    return function (password) {
        return regex.test(password) ? message : false;
    };
};

module.exports = L.map(patternCheck, patternChecks);
