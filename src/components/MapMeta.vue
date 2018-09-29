<template>
  <div class="map-meta">
    <router-link
      :to="{ name: 'profile', params: { 'username': map.author.username } }">
      <b-img :src="map.author.image" rounded="circle" style="width: 2rem; height: 2rem;"/>
    </router-link>
      <router-link
        :to="{ name: 'profile', params: { 'username': map.author.username } }"
        class="author">
        <span class="username">{{ map.author.username }}</span>
      </router-link>
      &nbsp;
      <span class="date">{{ map.createdAt | date }}</span>
    <template v-if="actions">
      <toponavo-map-actions
      :map="map"
      :canModify="isCurrentUser()"
      ></toponavo-map-actions>
    </template>
    <template v-else>
      <button
      class="btn btn-sm pull-xs-right"
      v-if="!actions"
      v-on:click="toggleFavorite"
      :class="{
        'btn-primary': map.favorited,
        'btn-outline-primary': !map.favorited
        }">
        <i class="ion-heart"></i>
        <span class="counter">
          {{ map.favoritesCount }}
        </span>
      </button>
    </template>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ToponavoMapActions from "@/components/MapActions";
import { FAVORITE_ADD, FAVORITE_REMOVE } from "@/store/actions.type";

export default {
  name: "ToponavoMapMeta",
  components: {
    ToponavoMapActions
  },
  props: {
    map: {
      type: Object,
      required: true
    },
    actions: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    ...mapGetters(["currentUser", "isAuthenticated"])
  },
  methods: {
    isCurrentUser() {
      if (this.currentUser.username && this.map.author.username) {
        return this.currentUser.username === this.map.author.username;
      }
      return false;
    },
    toggleFavorite() {
      if (!this.isAuthenticated) {
        this.$router.push({ name: "login" });
        return;
      }
      const action = this.map.favorited ? FAVORITE_REMOVE : FAVORITE_ADD;
      this.$store.dispatch(action, this.map.slug);
    }
  }
};
</script>
