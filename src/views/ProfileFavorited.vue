<template>
  <div class="profile-page">
    <ToponavoMapList
      :favorited="favorited"
      :items-per-page="5">
    </ToponavoMapList>
  </div>
</template>
<script>
  import ToponavoMapList from '@/components/MapList'

  export default {
    name: 'ToponavoProfileFavorited',
    components: {
      ToponavoMapList
    },
    computed: {
      favorited () {
        return this.$route.params.username
      }
    }
  }
</script>
