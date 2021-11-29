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
            <a class="nav-link" href="/levels">User Levels</a>
          </li>
          <li class="nav-item active">
            <a class="nav-link" href="#">Commit Messages</a>
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
            <h2 v-if="users">Viewing Commit Messages from {{users[0].repo_full_name}}</h2>
            <div v-else class="d-flex justify-content-center">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
        </div>
    </header>
    <section>
        <!-- Commits -->
        <div class="container mt-5">
            <div class="row row-cols-1 row-cols-md-1 g-5">
                <div v-for="user in users" :key="user.username">
                    <div class="col">
                        <div v-for="commit in user.commits" :key="commit.id">
                            <div class="card text-white bg-primary" style="width: 81rem;">
                                <div class="card-header">
                                    <div class="row align-items-start">
                                        <div class="col">
                                            {{commit.author}}
                                        </div>
                                        <div class="col">
                                            likes: {{commit.likes}}
                                        </div>
                                        <div class="col">
                                            {{convertDate(commit.timestamp)}}
                                        </div>
                                    </div>
                                </div>
                                <div class="card-body">
                                    <p class="card-text">Commit Message: {{commit.message}}</p>
                                    <p>
                                        Commit Link:
                                        <a :href="commit.html_url" class="card-link text-warning">{{commit.html_url}}</a>
                                    </p>
                                </div>
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
    async getCommitMessages() {
      try {
        this.username = localStorage.getItem("username");
        this.users = JSON.parse(localStorage.getItem("commit_data"));

        // if this.users is null, then we need to do the slow api call
        if (!this.users) {
          let temp_repo = JSON.parse(localStorage.getItem("repo_full_name"));
          let commits = {
              token: localStorage.getItem("jwt"),
              repo_full_name: temp_repo[0]
          };

          let response = await this.$http.post("/getCommits", commits);

          console.log(response);

          let token = response.data.token;
          localStorage.setItem("jwt", token);

          this.users = response.data.repo_users;

          let position = this.users.findIndex(user => user.username === this.username);
          if (position > 0) {
            let item = this.users.splice(position, 1);
            this.users.unshift(item[0]);
          }
          // store users in local storage so we don't have to do the slow api call
          // and nested loop comparisons every refresh
          localStorage.setItem("commit_data", JSON.stringify(this.users));
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
    },
    convertDate(isoDate) {
        let newDate = new Date(isoDate);
        return (newDate.getMonth() + 1) + "/" + newDate.getDate() + "/" + newDate.getFullYear()
    }
  },
  created() {
    this.getCommitMessages();
  }
};
</script>
<style scoped></style>