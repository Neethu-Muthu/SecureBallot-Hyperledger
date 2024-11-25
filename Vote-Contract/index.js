/*
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

const VotingContract = require("./lib/vote-contract");

module.exports.VotingContract = VotingContract;

module.exports.contracts = [VotingContract];