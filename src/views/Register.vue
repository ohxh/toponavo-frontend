<template>
  <div>
    <toponavo-header>
    </toponavo-header>
    <div class="settings-page" style="overflow-y: scroll; height: calc(100vh - 40px);">
      <div class="container page">
        <div class="row" style="margin-top: 2rem; margin-bottom: 1rem">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <h1 class="text-xs-center">Sign up</h1>
            <p>
            <router-link :to="{ name: 'login' }">
                Have an account?
              </router-link>
            </p>
              <ul v-if="errors" class="error-messages">
              <li v-for="(v, k) in errors" :key="k">{{k}} {{ v | error }}</li>
            </ul>
            <b-form v-on:submit.prevent="onSubmit">
              <b-form-group id="emailGroup" label="Email address:" label-for="email" description="We'll never share your email with anyone else.">
                <b-form-input id="email" type="email" v-model="email" required placeholder="Enter your email">
                </b-form-input>
              </b-form-group>
              <b-form-group id="usernameGroup" label="Username:" description="This also determines the URL of your profile page" label-for="username">
                <b-form-input id="username" type="text" v-model="username" required placeholder="Enter a username">
                </b-form-input>
              </b-form-group>
              <b-form-group id="bioGroup" label="Password:" label-for="password">
                <b-form-input id="password" type="password" v-model="password" required>
                </b-form-input>
              </b-form-group>
              <b-button type="submit" variant="primary">Sign up</b-button>
            </b-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { REGISTER } from "@/store/actions.type";
import ToponavoHeader from "@/components/ToponavoHeader";
export default {
  name: "ToponavoRegister",
  components: {
    ToponavoHeader
  },
  data() {
    return {
      username: "",
      email: "",
      password: ""
    };
  },
  computed: {
    ...mapState({
      errors: state => state.auth.errors
    })
  },
  methods: {
    onSubmit() {
      this.$store
        .dispatch(REGISTER, {
          email: this.email,
          password: this.password,
          username: this.username
        })
        .then(() =>
          this.$router.push({
            name: "home"
          })
        );
    }
  }
};
</script>
