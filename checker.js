"use strict";

var L = require("hsimp-library");

var checkerDictionary;
var checks = [];

var getChecks = function (string) {
    return L.filter(function (item) { return item; }, L.map(function (check) {
        return check(string);
    }, checks));
};

var translateChecks = function (item) {
    if (checkerDictionary.hasOwnProperty(item.id)) {
        var entry = checkerDictionary[item.id];

        return {
            level: item.level,
            name: item.value ? entry.name.replace("{{ value }}", item.value) : entry.name,
            message: item.value ? entry.message.replace("{{ value }}", item.value) : entry.message
        };
    }

    throw new Error("checker: Missing dictionary entry " + item.id);
};

var checker = function (string) {
    if (!checkerDictionary) {
        throw new Error("checker: dictionary not set");
    }

    var self = {},
        results;

    if (!L.isString(string)) {
        throw Error("checker: Invalid type");
    }

    results = L.map(translateChecks, getChecks(string));

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

checker.setDictionary = function (dictionary) {
    checkerDictionary = dictionary;
};

checker.setChecks = function (checksArray) {
    checks = checksArray;
};

module.exports = checker;
