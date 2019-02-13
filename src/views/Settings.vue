<template>
  <div>
    <toponavo-header>
    </toponavo-header>
    <div class="settings-page" style="overflow-y: scroll; height: calc(100vh - 40px);">
      <div class="container page">
        <div class="row" style="margin-top: 2rem; margin-bottom: 1rem">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <h1 class="text-xs-center">Your Settings</h1>
            <b-form @submit.prevent="updateSettings()">
              <b-form-group id="picture" label="Profile picture URL:" label-for="pictureURL">
                <b-form-input id="email" type="url" v-model="currentUser.image" placeholder="Enter a URL for your profile picture">
                </b-form-input>
              </b-form-group>
              <b-form-group id="emailGroup" label="Email address:" label-for="email" description="We'll never share your email with anyone else.">
                <b-form-input id="email" type="email" v-model="currentUser.email" required placeholder="Enter email">
                </b-form-input>
              </b-form-group>
              <b-form-group id="usernameGroup" label="Username:" description="This also determines the URL of your profile page" label-for="username">
                <b-form-input id="username" type="text" v-model="currentUser.username" required placeholder="Enter a username">
                </b-form-input>
              </b-form-group>
              <b-form-group id="bioGroup" label="Bio:" label-for="bio">
                <b-form-textarea id="bio" type="text" :rows="3" v-model="currentUser.bio" required placeholder="Enter a bio">
                </b-form-textarea>
              </b-form-group>
              <b-button type="submit" variant="primary">Update settings</b-button>
            </b-form>
      
            <!-- Line break for logout button -->
            <hr>
            <b-button @click="logout" variant="secondary">
                Or click here to logout.
              </b-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { LOGOUT, UPDATE_USER } from "@/store/actions.type";
import ToponavoHeader from "@/components/ToponavoHeader";
export default {
  name: "ToponavoSettings",
  components: {
    ToponavoHeader
  },
  computed: {
    ...mapGetters(["currentUser"])
  },
  methods: {
    updateSettings() {
      console.log(this.currentUser);
      this.$store.dispatch(UPDATE_USER, this.currentUser).then(() => {
        // #todo, nice toast and no redirect
        this.$router.push({
          name: "home"
        });
      });
    },
    logout() {
      this.$store.dispatch(LOGOUT).then(() => {
        this.$router.push({
          name: "home"
        });
      });
    }
  }
};
</script>
