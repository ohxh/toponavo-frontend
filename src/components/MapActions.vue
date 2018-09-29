<template>
  <!-- Used when user is also author -->
  <span v-if="canModify">
    <router-link
      class="btn btn-sm btn-outline-secondary"
      :to="{ name: 'map-edit', params: { slug: this.map.slug } }">
      <i class="ion-edit"></i>&nbsp;Edit Map
    </router-link>
    &nbsp;&nbsp;
    <button
      class="btn btn-outline-danger btn-sm"
      v-on:click="deleteMap(map.slug)">
      <i class="ion-trash-a"></i>&nbsp;Delete Map
    </button>
  </span>
  <!-- Used in MapView when not author -->
  <span v-else>
    <button
      class="btn btn-sm btn-outline-secondary"
      v-on:click="toggleFollow(profile.following)">
      <i class="ion-plus-round"></i>
      &nbsp;
      {{ profile.following ? 'Unfollow' : 'Follow' }} {{map.author.username}}
    </button>
    &nbsp;&nbsp;
    <button
      class="btn btn-sm"
      v-on:click="toggleFavorite(map.slug)"
      :class="{
        'btn-primary': map.favorited,
        'btn-outline-primary': !map.favorited
      }">
      <i class="ion-heart"></i>&nbsp;
      {{
        map.favorited
        ? 'Unfavorite Map'
        : 'Favorite Map'
      }}
      <span class="counter">
        ({{map.favoritesCount}})
      </span>
    </button>
  </span>
</template>

<script>
import { mapGetters } from 'vuex'
import { FAVORITE_ADD, FAVORITE_REMOVE, MAP_DELETE, FETCH_PROFILE_FOLLOW, FETCH_PROFILE_UNFOLLOW } from '@/store/actions.type'

export default {
  name: 'ToponavoMapActions',
  props: {
    map: { type: Object, required: true },
    canModify: { type: Boolean, required: true }
  },
  computed: {
    ...mapGetters([
      'profile',
      'isAuthenticated'
    ])
  },
  methods: {
    toggleFavorite (slug) {
      if (!this.isAuthenticated) {
        this.$router.push({name: 'login'})
        return
      }
      const action = this.map.favorited
        ? FAVORITE_REMOVE
        : FAVORITE_ADD
      this.$store.dispatch(action, slug)
    },
    toggleFollow (following) {
      if (!this.isAuthenticated) {
        this.$router.push({name: 'login'})
        return
      }
      const action = following ? FETCH_PROFILE_UNFOLLOW : FETCH_PROFILE_FOLLOW
      this.$store.dispatch(action, {
        username: this.profile.username
      })
    },
    editMap (slug, map) {
      this.$router.push({
        name: 'map-edit',
        params: { slug, previousMap: map }
      })
    },
    deleteMap (slug) {
      this.$store
        .dispatch(MAP_DELETE, slug)
        .then((res) => {
          this.$router.push('/')
        })
    }
  }
}
</script>
