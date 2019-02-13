<template>
  <b-navbar :sticky="true" toggleable="md" type="light" style="padding-top:0;padding-bottom:0; background-color: #fff;    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1); ">

    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
 
    <b-navbar-brand :to="{ name: 'home'}" style="font-family:rubik;">toponavo</b-navbar-brand>
    <b-collapse is-nav id="nav_collapse">

      <slot></slot>  
    
      <b-navbar-nav class="ml-auto">
      <b-nav-item :to="{ name: 'home' }">Home</b-nav-item>

      <b-nav-item-dropdown right v-if="currentUser.username">
        <!-- Using button-content slot -->
        <template slot="button-content">
          <em>@{{ currentUser.username}}</em>
        </template>
        
        <b-dropdown-item :to="{ name: 'profile', params: { username: currentUser.username } }">
          Profile
        </b-dropdown-item>
        <b-dropdown-item :to="{ name: 'settings' }">Settings</b-dropdown-item>
        <b-dropdown-item @click="logout">Signout</b-dropdown-item>
      </b-nav-item-dropdown>
      <b-nav-item :to="{ name: 'login' }" v-if="!currentUser.username">Login</b-nav-item>
      <b-nav-item :to="{ name: 'register' }" v-if="!currentUser.username">Sign up</b-nav-item>
    </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
import { mapGetters } from "vuex";
import { LOGOUT } from "@/store/actions.type";

export default {
  name: "EditHeader",
  props: ["title"],
  computed: {
    ...mapGetters(["currentUser", "isAuthenticated"])
  },
  methods: {
    logout() {
      this.$store.dispatch(LOGOUT).then(() => {
        this.$router.push({ name: "home" });
        this.$router.go(0);
      });
    }
  }
};
</script>
