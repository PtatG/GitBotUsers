/*
Project name: GitBot User Website
Written by: Phillip Tat
Date written: 10/17/21
For: UCF Senior Design Project
Purpose: Website for github bot users to see their levels, total experience earned,
and commit message data. (if possible, also send anonymous messages.)
*/
module.exports = app => {
  const users = require("../controllers/user.controller.js");
  const levels = require("../controllers/level.controller.js");
  const commits = require("../controllers/commit.controller.js");

  // register a user. repo_full_name, username,
  // and password are required inputs
  app.post("/registerUser", users.register);

  // login a user. username and password are required inputs
  app.post("/loginUser", users.login);

  // edit a user. This route is used for three different things
  // token is always required to use this route
  // password required if user wants to change their password
  // repo_full_name and add_repo required if user wants
  // to add or remove a repo from their repos
  // liked_commits (url), repo_full_name, and username
  // required to like or unlike a commit message
  app.put("/editUser", users.edit);

  // get all users from the repo_full_name to display their level info
  // token and repo_full_name are required inputs
  app.post("/getRepoUsers", levels.get);

  app.post("/getCommits", commits.get);

  // need route that checks github api if repo_full_name exists...
  // need route that checks github api if username exists

  // need route that allows user to change default repo
  // can be accomplished by moving new default repo to
  // index 0 in the repo_full_name array

  /* optional todo
  app.post("/deleteUser", users.delete);
  */
};
