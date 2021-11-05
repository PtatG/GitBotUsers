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
          data-toggle="collapse"
          data-target="#navbarNav"
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
            <li class="nav-item active">
              <a class="nav-link btn btn-secondary" @click="logUserOut" role="button">
                Sign out
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <header>
        <!-- Header -->
        <div class="container mt-5 d-flex justify-content-center">
            <h2>Viewing Users from {{users[0].repo_full_name}}</h2>
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
      users: {}
    };
  },
  methods: {
    async getUserLevels() {
      try {
        let levels = {
            token: localStorage.getItem("jwt"),
            repo_full_name: localStorage.getItem("repo_full_name")
        };

        let response = await this.$http.post("/getRepoUsers", levels);

        console.log(response);

        let token = response.data.token;
        localStorage.setItem("jwt", token);

        this.users = response.data.repo_users;
      } catch (err) {
        swal("Error", err.response.data.error, "error");
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