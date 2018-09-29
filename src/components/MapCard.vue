<template>
  <b-card style="margin-top: .8rem;">
      <toponavo-map-meta
      :map="map"
      :isPreview="true">
      </toponavo-map-meta>
     <router-link v-if="isCurrentUser()"
      :to="{name: 'map-edit', params: {'slug': map.slug}}" >
      <h1>{{map.title}}</h1>
     </router-link>
     <router-link v-else
      :to="{name: 'map', params: {'slug': map.slug}}">
      <h1>{{map.title}}</h1>
     </router-link>

    <p>Description{{map.description}}</p>
  </b-card>
</template>

<script>
import ToponavoMapMeta from "@/components/MapMeta";
import { mapGetters } from "vuex";

export default {
  name: "MapCard",
  props: {
    map: { type: Object, required: true }
  },
  components: {
    ToponavoMapMeta
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
    }
  }
};
</script>
