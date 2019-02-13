<template>
  <div>
    <toponavo-header>
    </toponavo-header>
    <div class="container">
      <div class="row" style="margin-top: 2rem; margin-bottom: 1rem">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <h1 class="text-xs-center">Sign in</h1>
          <p class="text-xs-center">
            <router-link :to="{ name: 'register' }">
              Need an account?
            </router-link>
          </p>
          <ul v-if="errors" class="error-messages">
            <li v-for="(v, k) in errors" :key="k">
              {{k}} {{ v | error }}
            </li>
          </ul>
          <form v-on:submit.prevent="onSubmit(email, password)">
            <fieldset class="form-group">
              <input class="form-control form-control-lg" type="text" v-model="email" placeholder="Email">
            </fieldset>
            <fieldset class="form-group">
              <input class="form-control form-control-lg" type="password" v-model="password" placeholder="Password">
            </fieldset>
            <button class="btn btn-lg btn-primary pull-xs-right">
                Sign in
              </button>
          </form>
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
