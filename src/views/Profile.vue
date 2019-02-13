<template>
    <div style="height: 100%;">
        <toponavo-header>
        </toponavo-header>
        <div style="overflow-y: scroll; height: calc(100vh - 40px);">
            <div class="container">
                <div class="row" style="margin-top: 2rem; margin-bottom: 1rem">
                    <div class="col-xs-12 col-md-10 offset-md-1">
                        <b-media>
                            <img slot="aside" :src="profile.image" class="user-img" />
                            <h4>{{ profile.username }}</h4>
                            <p>{{ profile.bio }}</p>
                            <div v-if="isCurrentUser()">
                                <router-link class="btn btn-sm btn-outline-secondary action-btn" :to="{ name: 'settings' }">
                                    <i class="ion-gear-a"></i> Edit Profile Settings
                                </router-link>
                            </div>
                        </b-media>
                    </div>
                </div>
            </div>
            <!--
        <div class="profile-page">
            <div class="user-info">
                <div class="container">
                    <div class="row">
                        <div class="col-xs-12 col-md-10 offset-md-1">
                            <img :src="profile.image" class="user-img"/>
                            <h4>{{ profile.username }}</h4>
                            <p>{{ profile.bio }}</p>
                            <div v-if="isCurrentUser()">
                                <router-link
                                        class="btn btn-sm btn-outline-secondary action-btn"
                                        :to="{ name: 'settings' }">
                                    <i class="ion-gear-a"></i> Edit Profile Settings
                                </router-link>
                            </div>
                            <div v-else>
                                <button
                                        class="btn btn-sm btn-secondary action-btn" v-if="profile.following"
                                        @click.prevent="unfollow()">
                                    <i class="ion-plus-round"></i>
                                    &nbsp;Unfollow {{ profile.username }}
                                </button>
                                <button
                                        class="btn btn-sm btn-outline-secondary action-btn"
                                        v-if="!profile.following"
                                        @click.prevent="follow()">
                                    <i class="ion-plus-round"></i>
                                    &nbsp;Follow {{ profile.username }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    -->
            <div class="container">
                <div class="row">
                    <div class="col-xs-12 col-md-10 offset-md-1">
                        <div class="maps-toggle">
                            <ul class="nav nav-pills outline-active">
                                <li class="nav-item">
                                    <router-link class="nav-link" active-class="active" exact :to="{ name: 'profile' }">
                                        My Maps
                                    </router-link>
                                </li>
                                <li class="nav-item">
                                    <router-link class="nav-link" active-class="active" exact :to="{ name: 'profile-favorites' }">
                                        Favorited Maps
                                    </router-link>
                                </li>
                            </ul>
                        </div>
                        <router-view></router-view>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from "vuex";
import {
  FETCH_PROFILE,
  FETCH_PROFILE_FOLLOW,
  FETCH_PROFILE_UNFOLLOW
} from "@/store/actions.type";
import ToponavoHeader from "@/components/ToponavoHeader";
export default {
  name: "ToponavoProfile",
  mounted() {
    this.$store.dispatch(FETCH_PROFILE, this.$route.params);
  },
  components: {
    ToponavoHeader
  },
  computed: {
    ...mapGetters(["currentUser", "profile", "isAuthenticated"])
  },
  methods: {
    isCurrentUser() {
      if (this.currentUser.username && this.profile.username) {
        return this.currentUser.username === this.profile.username;
      }
      return false;
    },
    follow() {
      if (!this.isAuthenticated) return;
      this.$store.dispatch(FETCH_PROFILE_FOLLOW, this.$route.params);
    },
    unfollow() {
      this.$store.dispatch(FETCH_PROFILE_UNFOLLOW, this.$route.params);
    }
  },
  watch: {
    $route(to) {
      this.$store.dispatch(FETCH_PROFILE, to.params);
    }
  }
};
</script>
