<template>
  <div class="container">
    <div class="row">
      <div class="col-lg-6 offset-lg-3 col-sm-10 offset-sm-1">
        <form
          class="text-center border border-primary p-5"
          style="margin-top:70px;height:auto;padding-top:50px !important;"
          @submit.prevent="loginUser"
        >
        <h2 style="padding-bottom:25px !important;">
          <img src="../../assets/logo.png" height="215" class="mb-3" alt="GitBot">
        </h2>
        
          <input
            type="text"
            id="username"
            class="form-control mb-5"
            placeholder="Username"
            v-model="login.username"
          />
          <!-- Password -->
          <input
            type="password"
            id="password"
            class="form-control mb-5"
            placeholder="Password"
            v-model="login.password"
          />
          <!-- Sign in button -->
          <center>
            <button class="btn btn-primary btn-block w-75 my-2" type="submit">
              Sign in
            </button>
          </center>
          <p>
          <br>Dont have an account?<br>
          <router-link to="/register">sign up</router-link>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import swal from 'sweetalert';

export default {
  data() {
    return {
      login: {
        username: "",
        password: ""
      }
    };
  },
  methods: {
    async loginUser() {
      try {
        let response = await this.$http.post("/loginUser", this.login);

        let token = response.data.token;
        let repo_full_name = response.data.repo_full_name;
        let username = response.data.username;
        let created_at = response.data.created_at;

        localStorage.setItem("jwt", token);
        // repo_full_name is an array but localStorage can't store arrays
        // so we turn it into a JSON string to store it
        localStorage.setItem("repo_full_name", JSON.stringify(repo_full_name));
        localStorage.setItem("username", username);
        localStorage.setItem("created_at", created_at);

        if (token) {
          this.$router.push("/home");
        }
      } catch (err) {
        if (err.response) {
          swal("Error", err.response.data.error, "error");
        } else {
          swal("Error", "Unexpected error.", "error");
        }
      }
    }
  }
};
</script>