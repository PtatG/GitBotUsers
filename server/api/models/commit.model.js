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

const CommitSchema = mongoose.Schema(
  {
    repo_owner: String,
    repo_full_name: {
      type: String,
      required: true
    },
    repo_name: String,
    repo_id: Number,
    repo_url: String,
    username: {
      type: String,
      required: true
    },
    user_id: Number,
    num_commits: Number,
    commits: {
      type: Array,
      default: []
    }
  },
  {
    // create or use gitBotUser collection
    collection: "commBotCommits"
  }
);

CommitSchema.plugin(uniqueValidator);
// "gitBotUser" section creates a collection in mongodb called "gitBotUsers"
// but it doesn't use camelcase
module.exports = mongoose.model("commBotCommits", CommitSchema);
