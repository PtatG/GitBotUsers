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

const UserSchema = mongoose.Schema(
  {
    repo_full_name: {
      type: Array,
      default: []
    },
    username: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    liked_commits: {
      type: Array,
      default: []
    },
    created_at: {
      type: Date,
      default: Date.now
    }
  },
  {
    // create or use gitBotUser collection
    collection: "gitBotUsers"
  }
);

UserSchema.plugin(uniqueValidator);
// "gitBotUser" section creates a collection in mongodb called "gitBotUsers"
// but it doesn't use camelcase
module.exports = mongoose.model("gitBotUsers", UserSchema);
