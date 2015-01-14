"use strict";

var L = require("library");

var checks = require("./checks");

var getChecks = function (string) {
    return L.filter(function (item) { return item; }, L.map(function (check) {
        return check(string);
    }, checks));
};

var checker = function (string) {
    var self = {},
        results;

    if (!L.isString(string)) {
        throw Error("checker: Invalid type");
    }

    results = getChecks(string);

    self.isInsecure = function () {
        return L.some(function (item) {
            return item.level === "insecure";
        }, results);
    };

    self.hasWarnings = function () {
        return L.some(function (item) {
            return item.level === "warning";
        }, results);
    };

    self.hasAchievements = function () {
        return L.some(function (item) {
            return item.level === "achievement";
        }, results);
    };

    self.getChecks = function () {
        return results;
    };

    return self;
};

module.exports = checker;
