<template>
<div>
    <b-navbar-nav> 
  <b-nav-text> Editing&nbsp;<b>{{title}}</b>&nbsp;</b-nav-text>
<b-nav-item-dropdown text="File" right>
        <b-dropdown-item href="#">Save (ctrl + s)</b-dropdown-item>
        <b-dropdown-item href="#">Make a copy</b-dropdown-item>
        <b-dropdown-item href="#">Import annotations</b-dropdown-item>
        <b-dropdown-item href="#">Export annotations</b-dropdown-item>
      </b-nav-item-dropdown>

    </b-navbar-nav>
</div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'EditHeader',
  props: ['title'],
  computed: {
    ...mapGetters(['currentUser', 'isAuthenticated'])
  }
}
</script>
