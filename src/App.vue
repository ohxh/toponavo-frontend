<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import ToponavoHeader from '@/components/ToponavoHeader'

export default {
  name: 'App',
  components: {
    ToponavoHeader
  }
}
</script>

<style>
</style>
