<template>
  <div class="container">
    <div class="row">
      <div class="col-lg-6 offset-lg-3 col-sm-10 offset-sm-1">
        <form
          class="border border-primary p-5"
          style="margin-top:70px;height:auto;padding-top:50px !important;"
          @submit.prevent="registerUser"
        >
        <h2 style="padding-bottom:25px !important;">
          <img src="../../assets/logo.png" height="215" class="mb-3" alt="GitBot">
        </h2>
          <b>Github Repo Full Name:</b>
          <input
            type="text"
            id="repo_full_name"
            class="form-control mb-5"
            placeholder="ex: repo_owner/repo_name"
            v-model="register.repo_full_name"
            required
          />
          <b>Github Username:</b>
          <input
            type="text"
            id="username"
            class="form-control mb-5"
            placeholder="Your github username"
            v-model="register.username"
            required
          />
          <!-- Password -->
          <b>Password:</b>
          <input
            type="password"
            id="password"
            class="form-control mb-5"
            placeholder="Enter a password"
            v-model="register.password"
          />
          <!-- Sign up button -->
          <center>
            <button class="btn btn-primary btn-block w-75 my-2" type="submit">
              Sign up
            </button>
          </center>
          <p align="center">
            <br>Already have an account?<br>
            <router-link to="/">sign in</router-link>
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
      register: {
        repo_full_name: "",
        username: "",
        password: ""
      }
    };
  },
  methods: {
    async registerUser() {
      try {
        let response = await this.$http.post("/registerUser", this.register);

        console.log(response);
        
        this.$router.push("/");
        swal("Success", response.data.message, "success");
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