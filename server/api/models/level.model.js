/*
Project name: GitBot User Website
Written by: Phillip Tat
Date written: 10/17/21
For: UCF Senior Design Project
Purpose: Website for github bot users to see their levels, total experience earned,
and commit message data. (if possible, also send anonymous messages.)
*/
const mongoose = require("mongoose");
uniqueValidator = require('mongoose-unique-validator');

const LevelSchema = mongoose.Schema(
  {
    repo_full_name: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true
    },
    num_commits: Number,
    issues_closed: Number,
    user_level: Number,
    exp_earned: Number
  },
  {
    // create or use gitBotUser collection
    collection: "gamBotLevels"
  }
);

LevelSchema.plugin(uniqueValidator);
// "gitBotUser" section creates a collection in mongodb called "gitBotUsers"
// but it doesn't use camelcase
module.exports = mongoose.model("gamBotLevels", LevelSchema);
