<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container">
        <div class="navbar-header">
          <a class="navbar-brand" href="/home">
            <img src="../../assets/logo.png" height="40" alt="GitBot">
          </a>
        </div>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <ul class="navbar-nav">
          <li class="nav-item active">
            <a class="nav-link" href="#">User Levels</a>
          </li>
          <li class="nav-item active">
            <a class="nav-link" href="/commits">Commit Messages</a>
          </li>
        </ul>
        <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="navbarMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                {{username}}
              </a>
              <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="navbarMenuLink">
                <li><a class="dropdown-item" href="#">Profile</a></li>
                <li><a class="dropdown-item" href="#">Edit Repos</a></li>
                <li><a class="dropdown-item" @click="logUserOut">Sign out</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <header>
        <!-- Header -->
        <div class="container mt-5 d-flex justify-content-center">
            <h2 v-if="users">Viewing Users from {{users[0].repo_full_name}}</h2>
            <div v-else class="d-flex justify-content-center">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
        </div>
    </header>
    <section>
        <!-- User Cards -->
        <div class="container mt-5">
            <div class="row row-cols-1 row-cols-md-3 g-5">
                <div v-for="user in users" :key="user.username">
                    <div class="col">
                        <div class="card text-white bg-primary h-100" style="width: 20rem;">
                            <div class="card-header" align="center">
                                <b>{{user.username}}</b>
                            </div>
                            <div class="card-body">
                                <p class="card-text">Level: {{user.user_level}}</p>
                                <p class="card-text">EXP Earned: {{user.exp_earned}}</p>
                                <p class="card-text">Commits: {{user.num_commits}}</p>
                                <p class="card-text">Issues Closed: {{user.issues_closed}}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  </div>
</template>
<script>
import swal from 'sweetalert';

export default {
  data() {
    return {
      users: {},
      username: {}
    };
  },
  methods: {
    async getUserLevels() {
      try {
        this.username = localStorage.getItem("username");
        this.users = JSON.parse(localStorage.getItem("level_data"));

        if (!this.users) {
          let temp_repo = JSON.parse(localStorage.getItem("repo_full_name"));
          let levels = {
              token: localStorage.getItem("jwt"),
              repo_full_name: temp_repo[0]
          };

          let response = await this.$http.post("/getRepoUsers", levels);

          console.log(response);

          let token = response.data.token;
          localStorage.setItem("jwt", token);

          this.users = response.data.repo_users;

          // put this user at front of array
          let position = this.users.findIndex(user => user.username === this.username);
          if (position > 0) {
            let item = this.users.splice(position, 1);
            this.users.unshift(item[0]);
          }
          localStorage.setItem("level_data", JSON.stringify(this.users));
        }
      } catch (err) {
        if (err.response) {
          swal("Error", err.response.data.error, "error");
        } else {
          swal("Error", "Unexpected error.", "error");
        }
      }
    },
    logUserOut() {
      localStorage.clear();
      this.$router.push("/");
    }
  },
  created() {
    this.getUserLevels();
  }
};
</script>
<style scoped></style>