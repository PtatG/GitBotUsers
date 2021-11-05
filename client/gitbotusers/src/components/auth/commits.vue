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
              <a class="nav-link" href="/levels">User Levels</a>
            </li>
            <li class="nav-item active">
              <a class="nav-link" href="#">Commit Messages</a>
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
            <h2>Viewing Commit Messages from {{users[0].repo_full_name}}</h2>
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
      users: {}
    };
  },
  methods: {
    async getCommitMessages() {
      try {
        let commits = {
            token: localStorage.getItem("jwt"),
            repo_full_name: localStorage.getItem("repo_full_name")
        };

        let response = await this.$http.post("/getCommits", commits);

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