<template>
  <div>
    <toponavo-header>
    </toponavo-header>
    <div class="settings-page" style="overflow-y: scroll; height: calc(100vh - 40px);">
      <div class="container page">
        <div class="row" style="margin-top: 2rem; margin-bottom: 1rem">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <h1 class="text-xs-center">Sign in</h1>
            <p>
            <router-link :to="{ name: 'register' }">
              Need an account?
            </router-link>
          </p>
          <ul v-if="errors" class="error-messages">
            <li v-for="(v, k) in errors" :key="k">
              {{k}} {{ v | error }}
            </li>
          </ul>
            <b-form v-on:submit.prevent="onSubmit(email, password)">
              <b-form-group id="emailGroup" label="Email address:" label-for="email">
                <b-form-input id="email" type="email" v-model="email" required placeholder="Enter your email">
                </b-form-input>
              </b-form-group>
              <b-form-group id="bioGroup" label="Password:" label-for="password">
                <b-form-input id="password" type="password" v-model="password" required>
                </b-form-input>
              </b-form-group>
              <b-button type="submit" variant="primary">Sign in</b-button>
            </b-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import ToponavoHeader from "@/components/ToponavoHeader";
import { LOGIN } from "@/store/actions.type";
export default {
  name: "ToponavoLogin",
  components: {
    ToponavoHeader
  },
  data() {
    return {
      email: null,
      password: null
    };
  },
  methods: {
    onSubmit(email, password) {
      this.$store
        .dispatch(LOGIN, {
          email,
          password
        })
        .then(() =>
          this.$router.push({
            name: "home"
          })
        );
    }
  },
  computed: {
    ...mapState({
      errors: state => state.auth.errors
    })
  }
};
</script>
