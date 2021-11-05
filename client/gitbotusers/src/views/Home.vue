<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container">
        <div class="navbar-header">
          <a class="navbar-brand" href="#">
            <img src="../assets/logo.png" height="40" alt="GitBot">
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
              <a class="nav-link" href="/levels">User Levels</a>
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
            <h2>User Profile</h2>
        </div>
    </header>
    <section>
      <div class="container mt-5">
        <div class="row">
          <div class="col-md-12">
            <ul class="list-group">
              <li class="list-group-item"><b>Username</b> : {{ user.username }}</li>
              <li class="list-group-item"><b>Repo Full Name</b> : {{ user.repo_full_name }}</li>
              <li class="list-group-item"><b>Account Created</b> : {{ user.created_at }}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
// import VueJwtDecode from "vue-jwt-decode";

export default {
  data() {
    return {
      user: {}
    };
  },
  methods: {
    getUserDetails() {
      let date = new Date(localStorage.getItem("created_at"));
      this.user = {
        repo_full_name: localStorage.getItem("repo_full_name"),
        username: localStorage.getItem("username"),
        created_at: (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear()
      };
    },
    logUserOut() {
      localStorage.clear();
      this.$router.push("/");
    }
  },
  created() {
    this.getUserDetails();
  }
};
</script>
<style scoped></style>