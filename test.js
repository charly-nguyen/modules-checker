"use strict";

/**
 * Testing Libraries
 */
var buster = require("buster");
var assert = buster.referee.assert;

/**
 * Setup
 */
var L = require("hsimp-library");
var checker = require("./checker");
var checkerDictionary = require("./checker-dictionary");

checker.setDictionary(checkerDictionary);

var patterns = require("hsimp-checks/checks/patterns");
var common = require("hsimp-checks/checks/common");

patterns.setDictionary(require("hsimp-checks/dictionaries/patterns.json"));
common.setDictionary(require("hsimp-checks/dictionaries/top10k.json"));

checker.setChecks([patterns, common]);

/**
 * Tests
 */
buster.testCase("checker", {
    "Top 10,000": {
        "password": function () {
            var check = checker("password"),
                results = check.getChecks();

            assert.same(check.isInsecure(), true);
            assert.same(results.length, 4);

            var insecure = L.prop(0, L.filter(function (item) {
                return item.level === "insecure";
            }, results));

            assert.same(insecure.message, "Your password is very commonly used. It would be cracked almost instantly.");
            assert.same(insecure.name, "Common Password: In the top 5 most used passwords");
        },
    },

    "order": function () {
        var check = checker("password"),
            results = check.getChecks();

        assert.same(results.length, 4);
        assert.same(results[0].level, "insecure");
        assert.same(results[1].level, "warning");
        assert.same(results[2].level, "warning");
        assert.same(results[3].level, "notice");
    }
});
