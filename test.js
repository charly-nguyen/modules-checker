"use strict";

/**
 * Testing Libraries
 */
var buster = require("buster");
var assert = buster.referee.assert;

/**
 * Setup
 */
var checker = require("./checker");

/**
 * Tests
 */
buster.testCase("checker", {
    "Top 10,000": {
        "password": function () {
            assert.same(checker("password").isInsecure(), true);
        },
    }
});