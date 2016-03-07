"use strict";

var L = require("hsimp-library");

var checkerDictionary;
var checks = [];

var getChecks = function (string) {
    return L.filter(function (item) { return item; }, L.map(function (check) {
        return check(string);
    }, L.reduce(function (checks, check) {
        return checks.concat(check.get());
    }, [], checks)));
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
        results,
        levels = ["highlight", "insecure", "warning", "achievement", "notice"];

    if (!L.isString(string)) {
        throw Error("checker: Invalid type");
    }

    results = L.map(translateChecks, getChecks(string)).sort(function (a, b) {
        var level = function (item) {
            var level = levels.indexOf(item.level);
            return level === -1 ? levels.length : level;
        };

        return level(a) - level(b);
    });

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

checker.setChecks = function (set) {
    var error = new Error("setChecks takes an array of check objects");

    if (!L.isArray(set)) {
        throw error;
    }

    set.forEach(function (check) {
        if (!L.isFunction(check.get)) {
            throw error;
        }
    });

    checks = set; 
};

module.exports = checker;
