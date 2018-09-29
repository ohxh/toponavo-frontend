<template>
  <div class="profile-page">
    <ToponavoMapList :author="author" :items-per-page="5"></ToponavoMapList>
  </div>
</template>
<script>
  import ToponavoMapList from '@/components/MapList'

  export default {
    name: 'ToponavoProfileMaps',
    components: {
      ToponavoMapList
    },
    computed: {
      author () {
        return this.$route.params.username
      }
    }
  }
</script>
